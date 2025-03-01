import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { useRecoilState } from "recoil";

import Swal from "sweetalert2";
import { loginAtom, userDataAtom } from "../../../atoms/userAtom";
import { isWhiteIcon } from "../../../atoms/noticeAtom";
import {
  getCookie,
  removeCookie,
  removeCookieRefresh,
} from "../../../components/cookie";
import Notification from "../../../components/notification/NotificationIcon";
import MenuBar from "../../../components/MenuBar";

function IndexPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useRecoilState(userDataAtom);
  const [isWhite, setIsWhite] = useRecoilState(isWhiteIcon);
  const [isLogin, setIsLogin] = useRecoilState(loginAtom);

  // sessionStorage에 저장된 userId 값을 가져옴
  const sessionUserId = window.sessionStorage.getItem("userId");

  useEffect(() => {
    // 알림 아이콘 검정색
    setIsWhite(false);

    const getUserInfo = async () => {
      try {
        if (sessionUserId) {
          const params = {
            userId: sessionUserId,
          };
          const accessToken = getCookie();
          const res = await axios.get(`/api/user`, {
            params,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const resultData = res.data.resultData;
          const phoneNumber = resultData.phone
            .replace(/[^0-9]/g, "")
            .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
            .replace(/(-{1,2})$/g, "");
          const pointParse = resultData.point.toLocaleString("ko-KR");
          console.log(resultData);
          console.log(res);

          setUserData({ ...resultData, phone: phoneNumber, point: pointParse });
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserInfo();
  }, []);

  const logoutHandler = () => {
    removeCookie();
    removeCookieRefresh();
    window.sessionStorage.removeItem("userId");
    setIsLogin(false);

    Swal.fire({
      title: "로그아웃 되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
      showConfirmButton: true,
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        navigate("/user");
      }
    });
  };

  return (
    <div className="h-dvh overflow-x-hidden overflow-y-scroll scrollbar-hide bg-white">
      <Notification />
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-3 py-5 border-b-2 border-gray border-opacity-70 bg-white">
        <IoMdArrowBack
          className="text-3xl cursor-pointer"
          onClick={() => navigate("/user")}
        />
        <span className="text-xl font-semibold pointer-events-none">
          내 정보
        </span>
        <span>&emsp;</span>
      </div>
      <div className="flex flex-col h-dvh justify-around mt-24 gap-10">
        <div className="w-full h-[30%] flex flex-col items-center gap-4">
          {userData.pic !== null ? (
            <img
              src={userData.pic}
              alt="프로필 이미지"
              className="w-32 rounded-full bg-auto"
            />
          ) : (
            <img
              src="/profile.jpeg"
              alt="프로필 이미지"
              className="w-32 rounded-full bg-auto"
            />
          )}
          <div className="flex items-center pointer-events-none">
            <span className="pr-3 ">사용가능 포인트</span>
            <span className="font-bold text-2xl">{userData.point}</span>
          </div>
          <span className="flex items-center gap-2 px-3 py-1 border-2 border-gray rounded-xl pointer-events-none">
            <MdOutlineMail className="text-xl" />
            {userData.email}
          </span>
          <div
            onClick={() => navigate("/user/userInfo/myreview")}
            className="flex items-center gap-1 cursor-pointer"
          >
            <span className="text-lg font-semibold">내가 작성한 리뷰</span>
            <IoIosArrowForward className="text-xl font-semibold" />
          </div>
        </div>
        <div className="h-[40%] flex justify-center items-center pointer-events-none">
          <div className="flex w-1/2 gap-5 items-center">
            <div className="flex flex-col w-[20%] gap-6 font-thin text-lg h-full text-darkGray text-nowrap">
              <span>닉네임</span>
              <span>이름</span>
              <span>아이디</span>
              <span>소속</span>
              <span>휴대폰</span>
            </div>
            <div className="flex flex-col w-[80%] gap-6 font-medium text-lg h-full text-no">
              {userData?.nickName ? (
                <span>{userData.nickName}</span>
              ) : (
                <span className="text-darkGray">닉네임 없음</span>
              )}
              <span>{userData.name}</span>
              <span>{userData.uid}</span>
              <span>{userData.companyName}</span>
              <span>{userData.phone}</span>
            </div>
          </div>
        </div>
        <div className="flex h-[20%] justify-center gap-5 mb-32">
          <div onClick={() => navigate("/user/userInfo/edit")}>
            <span className="flex px-3 py-1 bg-primary rounded-lg text-white font-semibold text-center cursor-pointer">
              회원정보 수정
            </span>
          </div>
          <div onClick={() => navigate("/auth/editpw")}>
            <span className="flex px-3 py-1 bg-primary rounded-lg text-white font-semibold text-center cursor-pointer">
              비밀번호 변경
            </span>
          </div>
          <div onClick={logoutHandler}>
            <span className="flex px-3 py-1 bg-primary rounded-lg text-white font-semibold text-center cursor-pointer">
              로그아웃
            </span>
          </div>
        </div>
        {/* <div
          onClick={logoutHandler}
          className="flex justify-center text-darkGray underline font-bold mb-32 cursor-pointer"
        >
          로그아웃
        </div> */}
      </div>
      <MenuBar />
    </div>
  );
}

export default IndexPage;
