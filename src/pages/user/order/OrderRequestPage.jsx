import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { MdOutlineRefresh } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ticketIdAtom, userDataAtom } from "../../../atoms/userAtom";
import { getCookie } from "../../../components/cookie";
import { memberDataAtom, orderIdAtom } from "../../../atoms/restaurantAtom";
import Swal from "sweetalert2";

const OrderRequestPage = () => {
  const [priceList, setPriceList] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [isCompleted, setIsCompleted] = useState({});
  const [userData, setUserData] = useRecoilState(userDataAtom);
  const [memberData, setMemberData] = useRecoilState(memberDataAtom);
  const [newTicketId, setNewTicketId] = useRecoilState(ticketIdAtom);
  const sessionUserId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  const locate = useLocation();
  const accessToken = getCookie();
  const { id } = useParams();
  const resId = locate.state;
  console.log("navigate 로 받아온 데이터 : ", resId);

  useEffect(() => {
    const params = {
      orderId: parseInt(id),
    };
    const getPaymentMember = async () => {
      try {
        const res = await axios.get("/api/user/user-payment-member", {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(res.data.resultData);
        const result = res.data.resultData;
        setPriceList([...result]);
      } catch (error) {
        console.log(error);
      }
    };
    getPaymentMember();
  }, []);

  const getUserApproval = async () => {
    const params = {
      orderId: parseInt(id),
    };
    try {
      const res = await axios.get(
        `/api/user/user-payment-member/approval-status`,
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("승인 상태 확인하기 : ", res.data.resultData);
      const result = res.data.resultData;
      setPriceList([...result]);
    } catch (error) {
      console.log(error);
    }
  };

  // 모든 유저가 결제 승인 후 서버에 최종적으로 결제 요청
  const postPayment = async () => {
    const payload = {
      orderId: parseInt(id),
    };
    try {
      const res = await axios.post(
        `/api/user/user-payment-member/insTicket`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log(res.data.resultData);
      const result = res.data.resultData;
      window.sessionStorage.setItem("ticketId", result);
      setNewTicketId(result);
      Swal.fire({
        title: "결제 완료!",
        text: "식권이 생성되었습니다.",
        timer: 2000,
      });
      navigate(`/user/order`);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "결제 오류",
        text: "다시 한번 시도해주세요",
        timer: 2000,
      });
    }
  };

  const patchApproval = async userId => {
    console.log(userId);

    const payload = {
      orderId: id,
      userId: userId,
      approvalStatus: 1,
    };
    console.log(payload);

    try {
      const res = await axios.patch(`/api/user/user-payment-member`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("서버에서 온 결과값 : ", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cancleButtonClick = async sessionUserId => {
    setIsCompleted(!isCompleted);
    console.log(sessionUserId);
    const params = {
      orderId: parseInt(id),
      userId: sessionUserId,
    };
    try {
      const res = await axios.delete("/api/user/user-payment-member", {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res.data);
      if (res.data.status === 200) {
        Swal.fire({
          title: "주문 취소",
          text: "주문이 취소되었습니다!",
          timer: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isDisabled = !priceList.every(item => item.approvalStatus === 1);

  return (
    <div className="w-full h-dvh overflow-x-hidden overflow-y-scroll scrollbar-hide">
      <div className="flex w-full justify-between py-6 items-center border-b border-gray">
        <div className="flex w-[15%] justify-center">
          <IoMdArrowBack className="text-3xl" />
        </div>
        <span className="text-lg font-semibold">결제 상태</span>
        <div className="w-[15%]">
          <span className="text-center px-3 py-1 rounded-md text-white text-opacity-0">
            &nbsp;
          </span>
        </div>
      </div>
      <div className="flex flex-col w-full h-full gap-6">
        <div className="flex w-full items-center justify-center mt-6">
          <div className="flex gap-2 px-5 py-2 bg-gray rounded-md">
            <MdOutlineRefresh className="text-2xl" />
            <span
              onClick={() => getUserApproval()}
              className="text-lg font-medium cursor-pointer"
            >
              승인 상태 확인
            </span>
          </div>
        </div>
        {Array.isArray(priceList) &&
          priceList.map((item, index) => (
            <div
              key={index}
              className="flex w-full h-[6%] px-6 justify-between items-center border-b border-gray"
            >
              <span className="flex w-[30%] text-base text-nowrap">
                {item.name}
              </span>
              <div className="flex w-[40%] gap-2 items-center justify-end">
                {isCompleted[item.userId] ? (
                  <>
                    <span className="text-end px-2 text-nowrap">
                      {item.point}
                    </span>
                    <span>원</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div>
                        {item.approvalStatus === 0 ? (
                          <span className="text-red font-semibold text-nowrap text-opacity-70">
                            대기중
                          </span>
                        ) : item.approvalStatus === 1 ? (
                          <span className="text-blue font-semibold text-nowrap">
                            승인
                          </span>
                        ) : (
                          <span className="text-red font-semibold text-nowrap">
                            거절
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-end px-1 text-nowrap">
                          {item.point.toLocaleString()}
                        </span>
                        <span>원</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        <div className="flex w-full justify-center gap-10">
          {priceList?.userId !== parseInt(sessionUserId) && (
            <>
              <button
                onClick={() => postPayment()}
                disabled={isDisabled}
                className={`text-lg px-2 py-1 rounded-md cursor-pointer ${
                  isDisabled
                    ? "bg-darkGray text-gray cursor-not-allowed"
                    : "bg-primary text-white"
                }`}
              >
                결제 요청
              </button>
              <button
                onClick={() => cancleButtonClick()}
                className={`text-lg px-2 py-1 rounded-md cursor-pointer bg-red text-white`}
              >
                결제 취소
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default OrderRequestPage;
