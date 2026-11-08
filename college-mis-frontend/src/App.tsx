import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useAuthStore } from './store/authStore';
import { AuthGuard } from './components/AuthGuard';
import MainLayout from './layouts/MainLayout';
import {
  LoginPage,
  StudentsPage,
  TeachersPage,
  AwardsPage,
  PapersPage,
  UnauthorizedPage,
  EasterEggPage,
  SecretEasterEggPage,
} from './pages';
import { useEffect } from 'react';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route
            path="/"
            element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }
          >
            <Route
              index
              element={
                <AuthGuard requiredRole="admin">
                  <StudentsPage />
                </AuthGuard>
              }
            />
            <Route
              path="teachers"
              element={
                <AuthGuard requiredRole="admin">
                  <TeachersPage />
                </AuthGuard>
              }
            />
            <Route
              path="awards"
              element={
                <AuthGuard>
                  <AwardsPage />
                </AuthGuard>
              }
            />
            <Route
              path="papers"
              element={
                <AuthGuard>
                  <PapersPage />
                </AuthGuard>
              }
            />
          </Route>
          
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
          
          {/* 彩蛋页面路由 */}
          <Route
            path="/easter-egg"
            element={
              <AuthGuard>
                <EasterEggPage />
              </AuthGuard>
            }
          />
          
          {/* 终极彩蛋页面路由 */}
          <Route
            path="/secret-easter-egg"
            element={
              <AuthGuard>
                <SecretEasterEggPage />
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
