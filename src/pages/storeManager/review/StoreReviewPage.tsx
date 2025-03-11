import styled from "@emotion/styled";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { PiSirenFill } from "react-icons/pi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SideBar from "../SideBar";
import axios from "axios";
import { getCookie } from "../../../components/cookie";

const LayoutDiv = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #eee;
  max-height: 100vh;
  height: auto;
  overflow: hidden;
`;

const ContentDiv = styled.div`
  margin-top: 32px;
  flex-wrap: wrap;
  padding: 20px 30px;
  padding-bottom: 30px;
  border-radius: 10px;
  width: 830px;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
  background-color: #fff;
`;

const TitleDiv = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
`;

const SideBarRightDiv = styled.div`
  box-shadow:
    0px 20px 25px -5px rgba(0, 0, 0, 0.1),
    0px 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 350px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;

interface ReviewData {
  nickName: string;
  userPic: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  reviewPic: string[];
  menuName: string[];
  commentText: string;
  commentCreatedAt: string;
}

function StoreReviewPage(): JSX.Element {
  // 별점 상태
  const rating = 5;
  // 댓글쓰기 버튼
  const [isClick, setIsClick] = useState(false);
  // 댓글 정보
  const [coment, setComent] = useState("");
  // 수정하기 버튼
  const [edit, setEdit] = useState(false);
  const [review, setReview] = useState<ReviewData>();

  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs(today).add(-1, "day").format("YYYY-MM-DD");

  const accessToken = getCookie();
  const adminId = sessionStorage.getItem("adminId");
  const restaurantId = sessionStorage.getItem("restaurantId");

  const getBlackList = async () => {
    const params = {
      adminId,
      restaurantId,
    };

    try {
      const res = await axios.get("/api/admin/restaurant/v3/black-list", {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("블랙리스트 조회 완료", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getReview = async () => {
    const params = {
      restaurantId,
    };
    try {
      const res = await axios.get("/api/restaurant/v3/review", { params });
      console.log("리뷰", res.data.resultData);
      setReview(res.data.resultData.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBlackList();
    getReview();
    console.log(accessToken);
    console.log("admin", adminId);
    console.log("rest", restaurantId);
  }, []);

  useEffect(() => {
    console.log("가져온 데이터??", review);
  }, [review]);

  useEffect(() => {
    console.log("댓글 내용", coment);
  }, [coment]);

  return (
    <div>
      <LayoutDiv>
        <SideBar />
        <ContentDiv className="scrollbar-hide">
          <TitleDiv>리뷰관리</TitleDiv>
          <div className="border-gray border mb-5"></div>
          <div className="mb-2 text-[18px]">전체 별점</div>
          <div className="flex gap-3 items-center mb-3">
            <FaStar className="text-yellow" />
            <div className="font-bold">4.8</div>
            <div className="text-darkGray">(총 리뷰 1,111개)</div>
          </div>
          <div className="inline-flex gap-3 items-center border border-gray px-4 py-2 rounded-[5px] mb-10">
            <div className="text-darkGray">조회기간</div>
            <input type="date" defaultValue={yesterday} />
            <div>~</div>
            <input type="date" defaultValue={today} />
          </div>

          {/* map 사용하기 */}
          {/* {review?.map((item, index) => <div key={index}>{item.nickName}</div>)} */}
          <div>
            <div className="flex gap-5">
              <div>
                <div className="font-bold mb-2">건물주 고양이</div>
                <div className="flex gap-3 items-center">
                  <div className="font-bold text-[20px]">5.0</div>
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, index) => {
                      const starIndex = index + 1;
                      return (
                        <FaStar
                          key={starIndex}
                          className={`w-[20px] h-[20px] ${starIndex <= rating ? "text-yellow" : "text-gray"}`}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="mt-2 text-darkGray">2025-02-23</div>
              </div>
              <div>
                <div>양도 많고 감자도 잘 튀겨졌어요~~~ 역시 최고 !!</div>
                <div className="flex w-[300px] my-3 gap-1">
                  <img
                    src="/swiper1.webp"
                    className="flex w-1/3 rounded-[5px]"
                    alt=""
                  />
                  <img
                    src="/swiper2.webp"
                    className="flex w-1/3 rounded-[5px]"
                    alt=""
                  />
                  <img
                    src="/swiper3.webp"
                    className="flex w-1/3 rounded-[5px]"
                    alt=""
                  />
                </div>
                <div className="mb-2">
                  모짜렐라인더 버거-베이컨 세트 1개, 양념감자(양파맛) 2개
                </div>
                {!isClick ? (
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-sm"
                    onClick={() => setIsClick(true)}
                  >
                    댓글쓰기
                  </button>
                ) : (
                  <div>
                    <ReactQuill
                      className="h-[150px]"
                      placeholder="소중한 리뷰에 답글을 남겨보세요!"
                      modules={{
                        toolbar: false,
                      }}
                      readOnly={false}
                      onChange={e => setComent(e)}
                    />
                    <div className="flex justify-end gap-3 mt-2">
                      <button
                        className="bg-gray py-1 px-3 rounded-[5px]"
                        onClick={() => setIsClick(false)}
                      >
                        취소
                      </button>
                      <button className="bg-primary text-white py-1 px-3 rounded-[5px]">
                        등록
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center cursor-pointer ml-24 text-red h-4">
                <PiSirenFill className="w-[20px] h-[20px]" />
                <div>신고하기</div>
              </div>
            </div>
            <div className="border-gray border my-5"></div>
          </div>
        </ContentDiv>

        {/* 블랙리스트 관리 */}
        <SideBarRightDiv>
          <TitleDiv className="text-center my-10">블랙리스트 목록</TitleDiv>
          <div className="mx-10 overflow-y-auto scrollbar-hide mb-5">
            {/* map 사용*/}
            <div>
              <div className="flex justify-between mt-2">
                <div>배고픈직장인(10001211)</div>
                {edit && (
                  <RiDeleteBin6Fill className="cursor-pointer w-5 h-5" />
                )}
              </div>
              <div className="border-gray border mt-2"></div>
            </div>
            <div>
              <div className="flex justify-between mt-2">
                <div>점심사냥꾼(10002213)</div>
                {edit && (
                  <button>
                    <RiDeleteBin6Fill className="cursor-pointer w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="border-gray border mt-2"></div>
            </div>
            <div>
              <div className="flex justify-between mt-2">
                <div>밥심으로버틴다(10003211)</div>
                {edit && (
                  <button>
                    <RiDeleteBin6Fill className="cursor-pointer w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="border-gray border mt-2"></div>
            </div>
            <div>
              <div className="flex justify-between mt-2">
                <div>맛집탐험가(10001201)</div>
                {edit && (
                  <button>
                    <RiDeleteBin6Fill className="cursor-pointer w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="border-gray border mt-2"></div>
            </div>
            <div>
              <div className="flex justify-between mt-2">
                <div>오늘뭐먹지(10001011)</div>
                {edit && (
                  <button>
                    <RiDeleteBin6Fill className="cursor-pointer w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="border-gray border mt-2"></div>
            </div>
          </div>
          <div className="mt-auto mb-5 flex justify-center">
            {edit ? (
              <button
                className="bg-primary text-white py-2 px-5 rounded-[5px]"
                onClick={() => setEdit(false)}
              >
                확인
              </button>
            ) : (
              <button
                className="bg-primary text-white py-2 px-5 rounded-[5px]"
                onClick={() => setEdit(true)}
              >
                수정하기
              </button>
            )}
          </div>
        </SideBarRightDiv>
      </LayoutDiv>
    </div>
  );
}
export default StoreReviewPage;
