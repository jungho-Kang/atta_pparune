import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Question = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className="h-[510px] flex flex-col">
      <div className="flex-grow">
        <div className="flex justify-center items-center">
          <div className="flex border-y border-black w-[1400px] text-center py-2 gap-5 text-darkGray">
            <div className="w-[10%]">No</div>
            <div className="w-[60%]">제목</div>
            <div className="w-[10%]">작성자</div>
            <div className="w-[20%]">작성일</div>
          </div>
        </div>
        {/* 아래선 추가 */}
        {/* <div className="flex justify-center">
          <div className="border-t border-tableGray w-[1400px]" />
        </div> */}
        {/* 내용 */}
        <div className="flex justify-center">
          <div className="flex border-b border-tableGray w-[1400px] text-center items-center py-2 gap-5">
            <div className="w-[10%] flex justify-center">
              <AiOutlineQuestionCircle />
            </div>
            <div
              className={"w-[60%] text-left cursor-pointer"}
              onClick={() => navigate(`/service/notice/detail`)}
            >
              개선 요구사항이 있어요!
            </div>
            <div className="w-[10%]">관리자</div>
            <div className="w-[20%]">2025-02-17</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex border-b border-tableGray w-[1400px] text-center items-center py-2 gap-5">
            <div className="w-[10%] flex justify-center">
              <AiOutlineQuestionCircle />
            </div>
            <div className="w-[60%] text-left">
              제휴 및 입점은 어떻게 하나요?
            </div>
            <div className="w-[10%]">관리자</div>
            <div className="w-[20%]">2025-02-17</div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex border-b border-tableGray w-[1400px] text-center items-center py-2 gap-5">
            <div className="w-[10%] flex justify-center">
              <AiOutlineQuestionCircle />
            </div>
            <div className="w-[60%] text-left">
              서비스 이용 방법이 궁금해요.
            </div>
            <div className="w-[10%]">관리자</div>
            <div className="w-[20%]">2025-02-17</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center bottom-0">
        <div className="relative flex w-[1400px] justify-center text-center gap-5 items-center">
          <div className="flex items-center border border-darkGray rounded-[5px] px-4 py-1 gap-2 h-[40px]">
            <input type="text" placeholder="검색어를 입력해 주세요" />
            <IoIosSearch className="text-darkGray cursor-pointer" />
          </div>
          <div
            className={
              "flex absolute right-0 items-center gap-[5px] bg-gray px-4 py-2 rounded-[5px] cursor-pointer"
            }
            onClick={() => navigate("/service/notice/writepost")}
          >
            <FiEdit />
            <button>글쓰기</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Question;
