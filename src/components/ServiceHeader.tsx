import { useEffect } from "react";
import { IoMdLogIn } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { roleAtom } from "../atoms/roleAtom";
import { menuState } from "../atoms/serviceAtom";

const ServiceHeader = (): JSX.Element => {
  const [menu, setMenu] = useRecoilState(menuState);
  const [_role, setRole] = useRecoilState(roleAtom);
  const location = useLocation();
  const navigate = useNavigate();

  const router = (path: string) => {
    navigate(`/service/${path}`);
  };

  useEffect(() => {
    switch (location.pathname) {
      case "/service/about":
        setMenu({ about: true, enroll: false, notice: false });
        break;
      case "/service/enroll":
        setMenu({ about: false, enroll: true, notice: false });
        break;
      case "/service/notice":
        setMenu({ about: false, enroll: false, notice: true });
        break;
      case "/service":
        setMenu({ about: true, enroll: true, notice: true });
        break;
    }
  }, [location]);
  return (
    <div className="flex w-[90%] justify-between items-center absolute z-20 left-24">
      <div
        className={"w-[12%] cursor-pointer"}
        onClick={() => navigate("/service")}
      >
        <img src="/logo.png" alt="" />
      </div>
      <ul className="flex px-10 py-4 gap-4 text-xl font-bold">
        <li
          className={`px-4 py-1 cursor-pointer ${menu.about ? "text-black" : "text-darkGray"}`}
          onClick={() => router("about")}
        >
          서비스 소개
        </li>
        <li
          className={`px-4 py-1 cursor-pointer ${menu.enroll ? "text-black" : "text-darkGray"}`}
          onClick={() => router("enroll")}
        >
          서비스 신청
        </li>
        <li
          className={`px-4 py-1 cursor-pointer ${menu.notice ? "text-black" : "text-darkGray"}`}
          onClick={() => router("notice")}
        >
          공지 / 문의
        </li>
        <li
          onClick={() => {
            setRole("");
            navigate("/auth");
          }}
          className="flex items-center gap-1.5 px-4 py-1 cursor-pointer"
        >
          <span>로그인</span>
          <IoMdLogIn />
        </li>
      </ul>
    </div>
  );
};

export default ServiceHeader;
