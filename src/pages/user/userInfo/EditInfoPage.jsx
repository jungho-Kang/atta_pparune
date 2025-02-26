import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { FaCameraRetro } from "react-icons/fa";
import { IoIosArrowForward, IoMdArrowBack } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import Swal from "sweetalert2";
import { isWhiteIcon } from "../../../atoms/noticeAtom";
import { loginAtom, userDataAtom } from "../../../atoms/userAtom";
import MenuBar from "../../../components/MenuBar";
import {
  getCookie,
  removeCookie,
  removeCookieRefresh,
} from "../../../components/cookie";
import Notification from "../../../components/notification/NotificationIcon";
import { debounce } from "lodash";

function EditInfoPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useRecoilState(userDataAtom);
  const [isWhite, setIsWhite] = useRecoilState(isWhiteIcon);
  const [isLogin, setIsLogin] = useRecoilState(loginAtom);
  const [inputPhone, setInputPhone] = useState(null);
  const [inputNickName, setInputNickName] = useState("");
  const [imageValue, setImageValue] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [cropImage, setCropImage] = useState(null);

  // sessionStorage에 저장된 userId 값을 가져옴
  const sessionUserId = window.sessionStorage.getItem("userId");

  useEffect(() => {
    if (!imageValue) {
      setPreviewImage("");
      return;
    }
    const objectUrl = URL.createObjectURL(imageValue);
    setPreviewImage(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageValue]);

  useEffect(() => {
    // 알림 아이콘 검정색
    setIsWhite(false);

    const getUserInfo = async () => {
      try {
        if (sessionUserId) {
          const params = { userId: sessionUserId };
          const accessToken = getCookie();
          const res = await axios.get(`/api/user`, {
            params,
            headers: { Authorization: `Bearer ${accessToken}` },
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

  const editSubmitHandler = async e => {
    e.preventDefault();
    const params = { userId: sessionUserId };
    try {
      const accessToken = getCookie();
      const payload = {
        nickName: inputNickName || userData.nickName,
        phone: inputPhone || userData.phone,
      };
      const res = await axios.patch(`/api/user`, payload, {
        params,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      Swal.fire({
        icon: "success",
        title: "수정이 완료되었습니다.",
        showConfirmButton: false,
        timer: 1500,
      });
      setUserData({ ...userData, ...payload });
      navigate("/user/userInfo");
    } catch (error) {
      console.error(error);
      Swal.fire("수정 실패", "정보 수정에 실패하였습니다.", "error");
    }
  };

  const cancleSubmitHandler = () => {
    Swal.fire({
      icon: "warning",
      title: "수정이 취소되었습니다.",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      navigate("/user/userInfo");
    });
  };

  const debouncedChange = useCallback(
    debounce(value => {
      console.log("delayInput : ", value);
      setInputNickName(value);
    }, 500),
    [],
  );

  const changeNickName = e => {
    debouncedChange(e.target.value);
  };

  useEffect(() => {
    return () => {
      debouncedChange.cancel();
    };
  }, [debouncedChange]);

  const changePhoneNumber = e => {
    const initNumber = e.target.value.replace(/[^0-9]/g, "");

    const ruleNumber = initNumber.slice(0, 11);

    const hypenPhone = ruleNumber
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, "$1-$2-$3")
      .replace(/(-{1,2})$/, "");

    setInputPhone(hypenPhone);
  };

  const changeImgHandler = e => {
    console.log(e.target.files[0]);
    const newProfile = e.target.files[0];
    setImageValue(newProfile);
  };

  const displayImage = previewImage || userData?.pic || "/profile.jpeg";

  return (
    <div className="h-dvh overflow-x-hidden overflow-y-scroll scrollbar-hide bg-white">
      <Notification />
      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-3 py-5 border-b-2 border-gray border-opacity-70 bg-white">
        <IoMdArrowBack
          className="text-3xl cursor-pointer"
          onClick={() => navigate("/user")}
        />
        <span className="text-xl font-semibold pointer-events-none">
          회원 정보 수정
        </span>
        <span>&emsp;</span>
      </div>
      <div className="flex flex-col h-dvh justify-around mt-24 gap-10">
        <div className="w-full h-[30%] flex flex-col items-center gap-4">
          {userData.pic !== null ? (
            <>
              <label htmlFor="profile">
                <div className="relative cursor-pointer">
                  <img
                    src={userData.pic}
                    alt="프로필 이미지"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 -right-1 text-xl bg-darkGray p-2 rounded-full border-4 border-white">
                    <input type="file" className="hidden" />
                    <FaCameraRetro className="text-white" />
                  </div>
                </div>
              </label>
              <input
                id="profile"
                type="file"
                className="absolute left-[5000px] hidden"
              />
            </>
          ) : (
            <>
              <label htmlFor="profile">
                <div className="relative cursor-pointer">
                  <img
                    src={displayImage}
                    alt="프로필 이미지"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 -right-1 text-xl bg-darkGray p-2 rounded-full border-4 border-white">
                    <FaCameraRetro className="text-white" />
                  </div>
                </div>
              </label>
              <input
                id="profile"
                type="file"
                className="absolute left-[5000px] hidden"
                onChange={changeImgHandler}
              />
            </>
          )}
          <div className="flex items-center pointer-events-none">
            <span className="pr-3">사용가능 포인트</span>
            <span className="font-bold text-2xl">{userData.point}</span>
          </div>
          <span className="flex items-center gap-2 px-3 py-1 border-2 border-gray rounded-xl pointer-events-none">
            <MdOutlineMail className="text-xl" />
            {userData.email}
          </span>
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="text-lg font-semibold">내가 작성한 리뷰</span>
            <IoIosArrowForward className="text-xl font-semibold" />
          </div>
        </div>
        <div className="h-[40%] flex justify-center items-center">
          <div className="flex w-1/2 gap-5 items-center">
            <div className="flex flex-col w-[20%] gap-6 font-thin text-lg h-full text-darkGray text-nowrap">
              <span>닉네임</span>
              <span>이름</span>
              <span>아이디</span>
              <span>소속</span>
              <span>휴대폰</span>
            </div>
            <div className="flex flex-col w-[80%] gap-6 font-medium text-lg h-full text-nowrap">
              <div className="flex items-center gap-2 cursor-pointer">
                {userData.nickName ? (
                  <span>{userData.nickName}</span>
                ) : (
                  <input
                    type="text"
                    placeholder={
                      userData?.nickName
                        ? userData.nickName
                        : "닉네임을 설정해주세요"
                    }
                    onChange={changeNickName}
                    className="flex w-48 border rounded-md px-2"
                  />
                )}
              </div>
              <span className="pointer-events-none">{userData.name}</span>
              <span className="pointer-events-none">{userData.uid}</span>
              <span className="pointer-events-none">
                {userData.companyName}
              </span>
              <div className="flex items-center gap-2 cursor-pointer">
                <input
                  type="tel"
                  value={inputPhone ? inputPhone : userData.phone}
                  onChange={changePhoneNumber}
                  className="flex w-48 border rounded-md px-2"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-[20%] justify-center gap-5 mb-32">
          <div onClick={editSubmitHandler}>
            <span className="flex px-3 py-1 bg-primary rounded-lg text-white font-semibold text-center cursor-pointer">
              수정 완료
            </span>
          </div>
          <div onClick={cancleSubmitHandler}>
            <span className="flex px-3 py-1 bg-darkGray rounded-lg text-white font-semibold text-center cursor-pointer">
              취소하기
            </span>
          </div>
        </div>
      </div>
      <MenuBar />
    </div>
  );
}

export default EditInfoPage;
