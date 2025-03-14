import { Suspense, lazy, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoginStoreAtom } from "./atoms/restaurantAtom";
import { loginAtom } from "./atoms/userAtom";
import StoreLayout from "./components/layouts/StoreLayout";
import UserLayout from "./components/layouts/UserLayout";
import Loading from "./components/Loading";
import {
  initializeSocket,
  subscribeStoreLogin,
  subscribeUserLogin,
} from "./components/notification/StompComponent";
import EnquiryPage from "./pages/admin/enquiry/EnquiryPage";
import FranchiseePage from "./pages/admin/franchisee/FranchiseePage";
import RefundPage from "./pages/admin/refund/RefundPage";
import DepositHistory from "./pages/admin/transaction/DepositHistory";
import PointHistory from "./pages/admin/transaction/PointHistory";
import DetailPage from "./pages/service/notice/DetailPage";
import OrderLoading from "./pages/user/order/OrderLoading";
import RequestPayment from "./pages/user/payment/RequestPayment";

const SkeletonLoader = () => (
  <div style={{ width: "100%", height: "100vh", backgroundColor: "#f3f3f3" }}>
    <p style={{ textAlign: "center", paddingTop: "50px" }}>Loading...</p>
  </div>
);

const preload = importFunc =>
  importFunc().then(module => ({ default: module.default }));

const IndexPage = lazy(() => import("./pages/IndexPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const UserMainPage = lazy(() =>
  preload(() => import("./pages/user/UserMainPage")),
);
const FindIdPage = lazy(() => import("./pages/auth/FindIdPage"));
const FindPwPage = lazy(() => import("./pages/auth/FindPwPage"));
const EditPwPage = lazy(() => import("./pages/auth/EditPwPage"));
const PolicyPage = lazy(() => import("./pages/auth/PolicyPage"));
const SignUpPage = lazy(() => import("./pages/auth/SignUpPage"));
const EmailAuthPage = lazy(() => import("./pages/auth/EmailAuthPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WritePostPage = lazy(
  () => import("./pages/service/notice/WritePostPage"),
);
const StoreReviewPage = lazy(
  () => import("./pages/storeManager/review/StoreReviewPage"),
);
const EnrollServicePage = lazy(
  () => import("./pages/service/EnrollServicePage"),
);
const AboutPage = lazy(() => import("./pages/service/AboutPage"));
const ServiceMainPage = lazy(() => import("./pages/service/IndexPage"));
const AddCompanyPage = lazy(() => import("./pages/service/AddCompanyPage"));
const NoticePage = lazy(() => import("./pages/service/notice/NoticePage"));
// JSX lazy Loading
const PaymentCheckoutPage = lazy(() =>
  import("./pages/company/toss/PaymentCheckoutPage").then(module => ({
    default: module.PaymentCheckoutPage,
  })),
);
const WidgetSuccessPage = lazy(() =>
  import("./pages/company/toss/WidgetSuccess").then(module => ({
    default: module.WidgetSuccessPage,
  })),
);
const TableComponent = lazy(
  () => import("./pages/admin/franchisee/Franchisee"),
);
const AdminPage = lazy(() => import("./pages/admin/AdminPage"));
const MyReviewPage = lazy(() => import("./pages/user/userInfo/MyReviewPage"));
const RestaurantReviewPage = lazy(
  () => import("./pages/user/restaurant/RestaurantReviewPage"),
);
const WriteReview = lazy(() => import("./pages/user/userInfo/WriteReview"));
const Order = lazy(() => import("./pages/user/payment/PaymentList"));
const Restaurant = lazy(() =>
  preload(() => import("./pages/user/restaurant/RestaurantPage")),
);
const Store = lazy(() => import("./pages/storeManager/StorePage"));
const MenuPage = lazy(() => import("./pages/storeManager/menu/StoreMenuPage"));
const StoreSales = lazy(
  () => import("./pages/storeManager/salesConfirm/Sales"),
);
const OrderPage = lazy(
  () => import("./pages/storeManager/salesConfirm/SalesPage"),
);
const EditInfoPage = lazy(() => import("./pages/user/userInfo/EditInfoPage"));
const UserInfo = lazy(() => import("./pages/user/userInfo/IndexPage"));
const PlaceToOrder = lazy(() => import("./pages/user/order/PlaceToOrder"));
const MealTicketPage = lazy(() => import("./pages/user/order/QRCode"));
const StoreInfoPage = lazy(
  () => import("./pages/storeManager/storeAuth/StoreInfoPage"),
);
const RestaurantDetailPage = lazy(() =>
  preload(() => import("./pages/user/restaurant/RestaurantDetailPage")),
);
const AddStorePage = lazy(() => import("./pages/service/AddStorePage"));
const OrderMemberPage = lazy(
  () => import("./pages/user/order/OrderMemberPage"),
);
const OrderPricePage = lazy(() => import("./pages/user/order/OrderPricePage"));
const MenuSelectPage = lazy(
  () => import("./pages/user/restaurant/MenuSelectPage"),
);
const OrderRequestPage = lazy(
  () => import("./pages/user/order/OrderRequestPage"),
);

const App = (): JSX.Element => {
  const sessionRestaurant = sessionStorage.getItem("restaurantId");
  const sessionUser = sessionStorage.getItem("userId");
  const [isLogin] = useRecoilState(loginAtom);
  const [isLoginStore] = useRecoilState(isLoginStoreAtom);

  useEffect(() => {
    initializeSocket();

    if (sessionRestaurant && isLoginStore) {
      subscribeStoreLogin(sessionRestaurant);
    }

    if (sessionUser && isLogin) {
      subscribeUserLogin(sessionUser);
    }
  }, [sessionRestaurant, sessionUser, isLogin, isLoginStore]);

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/auth">
            <Route index element={<LoginPage />} />
            <Route path="findid" element={<FindIdPage />} />
            <Route path="findpw" element={<FindPwPage />} />
            <Route path="editpw" element={<EditPwPage />} />
            <Route path="policy" element={<PolicyPage />} />
            <Route path="signup">
              <Route index element={<SignUpPage />} />
              <Route path="emailauth" element={<EmailAuthPage />} />
            </Route>
          </Route>

          {/* 사용자 */}
          <Route path="/user">
            <Route
              index
              element={
                <UserLayout>
                  <UserMainPage />
                </UserLayout>
              }
            />
            <Route path="userinfo">
              <Route
                index
                element={
                  <UserLayout>
                    <UserInfo />
                  </UserLayout>
                }
              />
              <Route
                path="edit"
                element={
                  <UserLayout>
                    <EditInfoPage />
                  </UserLayout>
                }
              />
              <Route
                path="myreview"
                element={
                  <UserLayout>
                    <MyReviewPage />
                  </UserLayout>
                }
              />
            </Route>
            <Route path="order">
              <Route
                index
                element={
                  <UserLayout>
                    <Order />
                  </UserLayout>
                }
              />
            </Route>
            <Route path="placetoorder">
              <Route
                index
                element={
                  <UserLayout>
                    <PlaceToOrder />
                  </UserLayout>
                }
              />
              <Route path="coupon">
                <Route
                  path=":id"
                  element={
                    <UserLayout>
                      <MealTicketPage />
                    </UserLayout>
                  }
                />
              </Route>
              <Route path="member">
                <Route
                  path=":id"
                  element={
                    <UserLayout>
                      <OrderMemberPage />
                    </UserLayout>
                  }
                />
              </Route>
              <Route path="price">
                <Route
                  path=":id"
                  element={
                    <UserLayout>
                      <OrderPricePage />
                    </UserLayout>
                  }
                />
              </Route>
              <Route path="request">
                <Route
                  path=":id"
                  element={
                    <UserLayout>
                      <OrderRequestPage />
                    </UserLayout>
                  }
                />
              </Route>
              <Route
                path="loading"
                element={
                  <UserLayout>
                    <OrderLoading />
                  </UserLayout>
                }
              />
            </Route>
            <Route path="restaurant">
              <Route
                index
                element={
                  <UserLayout>
                    <Restaurant />
                  </UserLayout>
                }
              />
              <Route path="detail">
                <Route
                  path=":id"
                  element={
                    <UserLayout>
                      <RestaurantDetailPage />
                    </UserLayout>
                  }
                />
                <Route
                  path="reserve/:id"
                  element={
                    <UserLayout>
                      <MenuSelectPage />
                    </UserLayout>
                  }
                />
                <Route
                  path="review/:id"
                  element={
                    <UserLayout>
                      <RestaurantReviewPage />
                    </UserLayout>
                  }
                />
              </Route>
            </Route>
            <Route
              path="review/:id"
              element={
                <UserLayout>
                  <WriteReview />
                </UserLayout>
              }
            />
          </Route>

          {/* 식당 */}
          <Route path="/store">
            <Route
              index
              element={
                <StoreLayout>
                  <Store />
                </StoreLayout>
              }
            />
            <Route
              path="menu"
              element={
                <StoreLayout>
                  <MenuPage />
                </StoreLayout>
              }
            />
            <Route
              path="order"
              element={
                <StoreLayout>
                  <OrderPage />
                </StoreLayout>
              }
            />
            <Route
              path="sales"
              element={
                <StoreLayout>
                  <StoreSales />
                </StoreLayout>
              }
            />
            <Route
              path="info"
              element={
                <StoreLayout>
                  <StoreInfoPage />
                </StoreLayout>
              }
            />
            <Route
              path="review"
              element={
                <StoreLayout>
                  <StoreReviewPage />
                </StoreLayout>
              }
            />
            <Route
              path="request"
              element={
                <UserLayout>
                  <RequestPayment />
                </UserLayout>
              }
            />
          </Route>
          {/* 서비스 소개 페이지 */}
          <Route path="/service">
            <Route index element={<ServiceMainPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="enroll">
              <Route index element={<EnrollServicePage />} />
              <Route path="addstore" element={<AddStorePage />} />
              <Route path="addcompany" element={<AddCompanyPage />} />
            </Route>
            <Route path="notice">
              <Route index element={<NoticePage />} />
              <Route path="writepost" element={<WritePostPage />} />
              <Route path="detail" element={<DetailPage />} />
            </Route>
          </Route>
          <Route path="/storeManage" element={<TableComponent />}></Route>

          <Route path="/admin">
            <Route index element={<AdminPage />} />
            <Route path="enquiry" element={<EnquiryPage />} />
            <Route path="franchisee" element={<FranchiseePage />} />
            <Route path="refund" element={<RefundPage />} />
            <Route path="deposit" element={<DepositHistory />} />
            <Route path="point" element={<PointHistory />} />
          </Route>

          {/* 회사 */}
          <Route path="/company">
            <Route index element={<PaymentCheckoutPage />} />
          </Route>

          {/* 결제 성공 */}
          <Route path="/success" element={<WidgetSuccessPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
