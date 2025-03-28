import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import Swal from "sweetalert2";
import { isLoginStoreAtom, reloadOrderAtom } from "../../atoms/restaurantAtom";
import { roleAtom } from "../../atoms/roleAtom";
import { loginAtom, userDataAtom } from "../../atoms/userAtom";
import { setCookie } from "../../components/cookie";
import { COMPANY, STORE, SYSTEM, USER } from "../../constants/Role";
import {
  CloseDiv,
  FormDiv,
  HeaderDiv,
  InputYupDiv,
  LayoutDiv,
  LoginBtn,
  LogoImg,
  RoleDiv,
  SignUpInput,
  TextSpan,
  TitleDiv,
} from "./loginStyle";
import { subscribeStoreLogin } from "../../components/notification/StompComponent";

function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useRecoilState(loginAtom);
  const [isLoginStore, setIsLoginStore] = useRecoilState(isLoginStoreAtom);
  const [userData, setUserData] = useRecoilState(userDataAtom);
  const [_reloadOrders, setReloadOrders] = useRecoilState(reloadOrderAtom);
  const [formData, setFormData] = useState({ id: "", pw: "" });
  const [hasVal, setHasVal] = useState(false);
  const sessionUserId = sessionStorage.getItem("userId");
  const sessionRestaurantId = sessionStorage.getItem("restaurantId");

  const { handleSubmit } = useForm();

  const role = useRecoilValue(roleAtom);
  const routeHandler = () => {
    if (role === USER) {
      navigate("/user");
    } else if (role === STORE) {
      navigate("/store");
    } else if (role === COMPANY) {
      navigate("/company");
    } else if (role === SYSTEM) {
      navigate("/admin");
    }
  };

  const postLogin = async () => {
    try {
      if (role === USER) {
        const res = await axios.post("/api/user/sign-in", formData);

        const result = res.data.resultData;
        setUserData({
          companyId: result.companyId,
          companyName: result.companyName,
          email: result.email,
          name: result.name,
          phone: result.phone,
          pic: result.pic,
          point: result.point,
          roleId: result.roleId,
          uid: result.uid,
          userId: result.userId,
        });

        console.log(result);
        const userId = result.userId || sessionUserId;
        const accessToken = result.accessToken;
        window.sessionStorage.setItem("userId", userId);
        setCookie(accessToken);
        setIsLogin(true);
        // subscribeUserLogin(userId);
      } else if (role === STORE) {
        const res = await axios.post("/api/admin/sign-in", formData);
        console.log(res.data.resultData);
        const result = res.data.resultData;

        const restaurantId = result.divisionId || sessionRestaurantId;
        const adminId = result.adminId;
        const coalitionState = result.coalitionState;
        const accessToken = result.accessToken;
        window.sessionStorage.setItem("adminId", adminId);
        window.sessionStorage.setItem("restaurantId", restaurantId);
        // 제휴 상태 확인 Status
        window.sessionStorage.setItem("coalitionState", coalitionState);
        setCookie(accessToken);
        setIsLoginStore(true);
        subscribeStoreLogin(restaurantId);
      } else if (role === COMPANY) {
        const res = await axios.post("/api/admin/sign-in", formData);
        console.log(res.data.resultData);
        const result = res.data.resultData;
        const adminId = result.adminId;
        const companyId = result.divisionId;
        const accessToken = result.accessToken;
        window.sessionStorage.setItem("adminId", adminId);
        window.sessionStorage.setItem("companyId", companyId);
        setCookie(accessToken);
      } else if (role === SYSTEM) {
        const res = await axios.post("/api/admin/sign-in", formData);
        console.log(res.data.resultData);
        const result = res.data.resultData;
        const adminId = result.adminId;
        const accessToken = result.accessToken;
        window.sessionStorage.setItem("adminId", adminId);
        setCookie(accessToken);
      }
      setIsLogin(true);
      routeHandler();
    } catch (error) {
      Swal.fire({
        title: "아이디와 비밀번호가 일치하지 않습니다.",
        icon: "error",
        confirmButtonText: "확인",
        showConfirmButton: true, // ok 버튼 노출 여부
        allowOutsideClick: false, // 외부 영역 클릭 방지
      });
      console.log(error);
    }
  };

  const handleSubmitForm = () => {
    postLogin();
  };

  useEffect(() => {
    if (isLogin) {
      navigate(-1);
    }
  }, []);

  useEffect(() => {
    if (formData.id && formData.pw) {
      setHasVal(true);
    } else {
      setHasVal(false);
    }
  }, [formData]);

  return (
    <LayoutDiv>
      <HeaderDiv>
        <CloseDiv>
          <IoMdClose
            style={{ width: "100%", height: "100%", cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
        </CloseDiv>
      </HeaderDiv>
      <TitleDiv>
        <LogoImg src="/logo.png" alt="로고" />
        <RoleDiv>
          {role === USER
            ? "사용자"
            : role === STORE
              ? "사장님"
              : role === COMPANY
                ? "회사"
                : role === SYSTEM
                  ? "시스템"
                  : ""}
        </RoleDiv>
      </TitleDiv>
      <FormDiv>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <InputYupDiv>
            <SignUpInput
              type="text"
              placeholder="아이디"
              value={formData.id}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
            />
          </InputYupDiv>
          <InputYupDiv>
            <SignUpInput
              type="password"
              value={formData.pw}
              placeholder="비밀번호 (8-16자)"
              onChange={e => setFormData({ ...formData, pw: e.target.value })}
            />
          </InputYupDiv>
          <div style={{ marginLeft: 20, marginRight: 20 }}>
            <LoginBtn
              type="submit"
              style={{
                backgroundColor: hasVal ? "#6F4CDB" : "#ddd",
              }}
              disabled={!hasVal}
            >
              로그인
            </LoginBtn>
          </div>
        </form>
      </FormDiv>
      <TextSpan onClick={() => navigate("/auth/findid")}>아이디 찾기</TextSpan>
      <TextSpan style={{ color: "#bababa" }}>I</TextSpan>
      <TextSpan onClick={() => navigate("/auth/findpw")}>
        비밀번호 찾기
      </TextSpan>
      {/* {role === STORE && (
        <>
          <TextSpan style={{ color: "#bababa" }}>I</TextSpan>
          <TextSpan
            style={{ marginRight: 25 }}
            onClick={() => navigate("/auth/policy")}
          >
            회원가입
          </TextSpan>
        </>
      )} */}
    </LayoutDiv>
  );
}

export default LoginPage;
