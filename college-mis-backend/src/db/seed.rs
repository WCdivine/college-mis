use bcrypt::hash;
use sqlx::SqlitePool;

/// 首次启动时写入演示数据（已有 teacher1 账号则跳过）
pub async fn seed_demo(pool: &SqlitePool) {
    let exists: Option<(i64,)> =
        sqlx::query_as("SELECT 1 FROM users WHERE username = 'teacher1'")
            .fetch_optional(pool)
            .await
            .ok()
            .flatten();
    if exists.is_some() {
        return;
    }

    tracing::info!("检测到空数据库，正在写入演示数据……");
    if let Err(e) = seed_inner(pool).await {
        tracing::error!("写入演示数据失败：{}", e);
    }
}

async fn seed_inner(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    const TEACHER_PWD: &str = "teacher123";
    const STUDENT_PWD: &str = "student123";

    let pwd_teacher = hash(TEACHER_PWD, 8).expect("hash teacher pwd");
    let pwd_student = hash(STUDENT_PWD, 8).expect("hash student pwd");

    // ---------- 教师 ----------
    let teachers: [(&str, &str, &str, &str, &str, &str); 5] = [
        ("teacher1", "陈建国", "E1998001", "数学系", "教授", "1998-07-01"),
        ("teacher2", "王晓芳", "E2005032", "数学系", "副教授", "2005-09-01"),
        ("teacher3", "李文博", "E2015078", "数学系", "讲师", "2015-07-15"),
        ("teacher4", "张丽娟", "E2010114", "统计学系", "副教授", "2010-08-20"),
        ("teacher5", "刘志强", "E2019021", "信息与计算科学系", "讲师", "2019-07-01"),
    ];
    let mut teacher_ids: Vec<i64> = Vec::new();
    for (u, name, emp, dept, title, hire) in teachers {
        let (uid,): (i64,) = sqlx::query_as(
            "INSERT INTO users (username, password, role) VALUES (?, ?, 'teacher') RETURNING id",
        )
        .bind(u)
        .bind(&pwd_teacher)
        .fetch_one(pool)
        .await?;
        let (tid,): (i64,) = sqlx::query_as(
            "INSERT INTO teachers (user_id, name, employee_id, department, title, hire_date) \
             VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
        )
        .bind(uid)
        .bind(name)
        .bind(emp)
        .bind(dept)
        .bind(title)
        .bind(hire)
        .fetch_one(pool)
        .await?;
        teacher_ids.push(tid);
    }

    // ---------- 学生 ----------
    let students: [(&str, &str, &str, &str, &str, i32); 8] = [
        ("student1", "赵晨阳", "202322010101", "数学系", "数学与应用数学", 2023),
        ("student2", "钱雨桐", "202322010102", "数学系", "数学与应用数学", 2023),
        ("student3", "孙浩然", "202422010103", "数学系", "信息与计算科学", 2024),
        ("student4", "周诗涵", "202422010104", "数学系", "统计学", 2024),
        ("student5", "吴宇轩", "202222010105", "数学系", "数学与应用数学", 2022),
        ("student6", "郑安琪", "202522010106", "数学系", "数学与应用数学", 2025),
        ("student7", "冯子豪", "202222010107", "统计学系", "统计学", 2022),
        ("student8", "陈佳怡", "202522010108", "信息与计算科学系", "信息与计算科学", 2025),
    ];
    let mut student_ids: Vec<i64> = Vec::new();
    for (u, name, sid, dept, major, year) in students {
        let (uid,): (i64,) = sqlx::query_as(
            "INSERT INTO users (username, password, role) VALUES (?, ?, 'student') RETURNING id",
        )
        .bind(u)
        .bind(&pwd_student)
        .fetch_one(pool)
        .await?;
        let (stid,): (i64,) = sqlx::query_as(
            "INSERT INTO students (user_id, name, student_id, department, major, enrollment_year) \
             VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
        )
        .bind(uid)
        .bind(name)
        .bind(sid)
        .bind(dept)
        .bind(major)
        .bind(year)
        .fetch_one(pool)
        .await?;
        student_ids.push(stid);
    }

    // ---------- 获奖 ----------
    let awards: [(i64, &str, &str, &str, &str, &str); 8] = [
        (student_ids[0], "student", "全国大学生数学建模竞赛国家一等奖", "国家级", "2025-11-08", "高教社杯全国大学生数学建模竞赛（CUMCM）本科组"),
        (student_ids[2], "student", "美国大学生数学建模竞赛一等奖（M奖）", "国际级", "2026-02-10", "MCM/ICM Meritorious Winner"),
        (student_ids[4], "student", "全国大学生数学竞赛（数学A类）省级一等奖", "省级", "2025-10-25", "第十六届全国大学生数学竞赛省级赛区"),
        (student_ids[1], "student", "丘成桐大学生数学竞赛铜奖", "国家级", "2026-06-20", "分析与方程方向"),
        (student_ids[0], "student", "国家奖学金", "国家级", "2025-10-15", "2024-2025学年"),
        (student_ids[3], "student", "校级三好学生", "校级", "2025-12-10", "2024-2025学年"),
        (student_ids[5], "student", "全国大学生英语竞赛C类二等奖", "国家级", "2025-05-18", "全国大学生英语竞赛（NECCS）"),
        (teacher_ids[1], "teacher", "高校教师教学创新大赛省级一等奖", "省级", "2025-07-12", "省教育厅主办"),
    ];
    for (owner_id, owner_type, title, level, date, desc) in awards {
        sqlx::query(
            "INSERT INTO awards (owner_id, owner_type, title, level, date, description) \
             VALUES (?, ?, ?, ?, ?, ?)",
        )
        .bind(owner_id)
        .bind(owner_type)
        .bind(title)
        .bind(level)
        .bind(date)
        .bind(desc)
        .execute(pool)
        .await?;
    }

    // ---------- 论文 ----------
    let papers: [(i64, &str, &str, &str, &str, &str, &str); 5] = [
        (student_ids[4], "student", "一类带非线性阻尼项的波动方程解的爆破性质研究", "数学学报", "2025-08-01", "吴宇轩，陈建国", "10.13421/zgsxxb.2025.012"),
        (student_ids[3], "student", "基于Lasso-分位数回归的极端降水统计降尺度方法", "统计与决策", "2025-11-20", "周诗涵，张丽娟", "10.13546/j.cnki.tjyjc.2025.11.002"),
        (student_ids[1], "student", "若干图结构的谱刻画及其应用", "大学学报（自然科学版）", "2024-12-15", "钱雨桐，王晓芳", "10.1234/univ-journal.2024.06.003"),
        (student_ids[0], "student", "随机神经网络动力学系统的矩稳定性分析", "应用数学和力学", "2025-05-10", "赵晨阳，李文博", "10.21656/1000-0887.450123"),
        (student_ids[2], "student", "深度学习驱动的偏微分方程数值求解方法综述", "数学的实践与认识", "2026-01-08", "孙浩然，刘志强", "10.1234/sxdsjyrs.2026.01.001"),
    ];
    for (owner_id, owner_type, title, journal, date, authors, doi) in papers {
        sqlx::query(
            "INSERT INTO papers (owner_id, owner_type, title, journal, publish_date, authors, doi) \
             VALUES (?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(owner_id)
        .bind(owner_type)
        .bind(title)
        .bind(journal)
        .bind(date)
        .bind(authors)
        .bind(doi)
        .execute(pool)
        .await?;
    }

    tracing::info!("演示数据写入完成：5名教师、8名学生、8项获奖、5篇论文");
    tracing::info!("演示账号：admin/admin123，teacher1/teacher123，student1/student123");
    Ok(())
}
