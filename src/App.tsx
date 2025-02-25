import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import LayoutAdmin from 'components/admin/layout.admin';
import Footer from 'components/client/footer.client';
import Header from 'components/client/header.client';
import OAuthCallback from "components/client/oauth-callback";
import NotFound from 'components/share/not.found';
import ProtectedRoute from 'components/share/protected-route.ts';
import PostLimitPage from "pages/admin/post-limit";
import PaymentPage from "pages/admin/statistical/payment";
import RevenueStatistics from "pages/admin/statistical/revenueStatistics";
import ForgetPassword from 'pages/auth/forgetPassword';
import LoginPage from 'pages/auth/login';
import RegisterPage from 'pages/auth/register';
import HomePage from 'pages/home';
import DonatePage from "pages/home/donate";
import EmployerPage from 'pages/home/employer';
import { useEffect, useRef, useState } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from 'styles/app.module.scss';
import ViewUpsertJob from './components/admin/job/upsert.job';
import ManageAccount from './components/client/modal/manage.account';
import EmailSubscription from './components/client/profile/EmailSubscription';
import MyJobs from './components/client/profile/MyJob';
import ProfileAccount from './components/client/profile/ProfileAccount';
import Settings from './components/client/profile/Settings';
import LayoutApp from './components/share/layout.app';
import CompanyPage from './pages/admin/company';
import DashboardPage from './pages/admin/dashboard';
import JobTabs from './pages/admin/job/job.tabs';
import PermissionPage from './pages/admin/permission';
import ResumePage from './pages/admin/resume';
import RolePage from './pages/admin/role';
import UserPage from './pages/admin/user';
import ClientCompanyPage from './pages/company';
import ClientCompanyDetailPage from './pages/company/detail';
import ClientJobPage from './pages/job';
import ClientJobDetailPage from './pages/job/detail';
import { fetchAccount } from './redux/slice/accountSlide';
const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  }, [location]);



  return (
    <div className='layout-app' ref={rootRef}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className={styles['content-app']}>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);


  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
      || window.location.pathname === '/forget-password'

    )
      return;
    dispatch(fetchAccount())
  }, [])



  const router = createBrowserRouter([
    {
      path: "/employer",
      element: <EmployerPage />
    },
    {
      path: "/profile/settings",
      element: <Settings />
    },
    {
      path: "/profile/email-subscription",
      element: <EmailSubscription />
    },
    {
      path: "/manage-account",
      element: <ManageAccount open={true} onClose={() => { }} />
    },
    {
      path: "/profile",
      element: <ProfileAccount />
    },
    {
      path: "/profile/my-jobs",
      element: <MyJobs />
    },
    {
      path: "/donate",
      element: <DonatePage />
    },

    {
      path: "/auth/google-callback",
      element: <OAuthCallback />,
    },
    {
      path: "/auth/facebook-callback",
      element: <OAuthCallback />,
    },
    {
      path: "/forget-password",
      element: <ForgetPassword />,
    },
    {
      path: "/",
      element: (<LayoutApp><LayoutClient /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "job", element: <ClientJobPage /> },
        { path: "job/:id", element: <ClientJobDetailPage /> },
        { path: "company", element: <ClientCompanyPage /> },
        { path: "company/:id", element: <ClientCompanyDetailPage /> }
      ],
    },

    {
      path: "/admin",
      element: (<LayoutApp><LayoutAdmin /> </LayoutApp>),
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
        },
        {
          path: "company",
          element:
            <ProtectedRoute>
              <CompanyPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
        },
        {
          path: "/admin/post-limit",
          element:
            <ProtectedRoute>
              <PostLimitPage />
            </ProtectedRoute>
        },

        {
          path: "job",
          children: [
            {
              index: true,
              element: <ProtectedRoute><JobTabs /></ProtectedRoute>
            },
            {
              path: "upsert", element:
                <ProtectedRoute><ViewUpsertJob /></ProtectedRoute>
            }
          ]
        },

        {
          path: "resume",
          element:
            <ProtectedRoute>
              <ResumePage />
            </ProtectedRoute>
        },
        {
          path: "permission",
          element:
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>
        },
        {
          path: "role",
          element:
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>
        },
        {
          path: "/admin/payment",
          children: [
            {
              path: "stats",
              element: <RevenueStatistics />
            },
            {
              path: "list",
              element: <PaymentPage />
            }
          ]
        }
      ],
    },


    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },

  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}