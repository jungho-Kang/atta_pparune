/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientSideRowModelModule, ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { Pagination, PaginationProps } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { getCookie } from "../../../components/cookie";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { pointState } from "../../../atoms/companyPointAtom";
import dayjs from "dayjs";

interface EmployeeListType {
  userId: number;
  id: number;
  uid: string;
  name: string;
  phone: string;
  email: string;
  point: string;
  activation: number;
}

const EmployeeList = (): JSX.Element => {
  const [data, setData] = useState<EmployeeListType[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [isOpen, setIsOpen] = useState({
    deposit: false,
    collect: false,
  });
  const [pointAmount, setPointAmount] = useState("");
  // patch할 userId
  const [userId, setUserId] = useState(0);
  const [_, setPoint] = useRecoilState(pointState);

  const companyId = sessionStorage.getItem("companyId");
  const adminId = Number(sessionStorage.getItem("adminId") as string);
  const accessToken = getCookie();
  const date = dayjs(new Date()).format("YYYY-MM");

  const EMPTY_ROW_COUNT = 15;
  const tableData = data;

  // 입금 포인트 내용 오른쪽 정렬
  const PointRenderer = (props: any) => {
    return (
      <div className="flex justify-end items-center">
        <span className="font-bold italic">{props.value}</span>
      </div>
    );
  };

  // 활성화 / 비활성화 버튼
  const ActiveRenderer = (props: any) => {
    // 데이터가 없으면 버튼을 렌더링하지 않음
    if (!props.data || !props.data.id || !props.data.uid) {
      return null; // 빈 데이터나 인덱스가 비어있으면 버튼을 렌더링하지 않음
    }

    return (
      <div className="flex justify-center">
        <span
          onClick={() => {
            Swal.fire({
              title: `${props.data.name}님을 ${props.data.activation === 0 ? "비활성화" : "활성화"} 하시겠습니까?`,
              icon: "question",
              confirmButtonText: "확인",
              cancelButtonText: "취소",
              showConfirmButton: true,
              allowOutsideClick: false,
            }).then(result => {
              if (result.isConfirmed) {
                patchEmployee(
                  props.data.userId,
                  props.data.name,
                  props.data.activation,
                );
              }
            });
          }}
          className={`text-white cursor-pointer px-3 rounded-[5px] ${props.data.activation === 0 ? "bg-darkGray hover:bg-black" : "bg-primary hover:bg-primaryFocus"}`}
        >
          {props.data.activation === 0 ? "비활성화" : "활성화"}
        </span>
      </div>
    );
  };

  // 입금하기 버튼
  const SendRenderer = (props: any) => {
    if (!props.data || !props.data.id || !props.data.uid) {
      return null;
    }

    return (
      <div className="flex justify-center">
        <span
          onClick={() => {
            if (props.data.activation === 0) {
              setUserId(props.data.userId);
              setIsOpen({ deposit: true, collect: false });
            } else {
              Swal.fire(
                "현재 지원되지 않는 기능입니다.",
                "회원 상태를 활성화한 후 이용해 주세요.",
                "error",
              );
            }
          }}
          className="bg-green hover:bg-greenHover text-white cursor-pointer px-3 rounded-[5px]"
        >
          입금하기
        </span>
      </div>
    );
  };

  // 회수하기 버튼
  const CollectRenderer = (props: any) => {
    if (!props.data || !props.data.id || !props.data.uid) {
      return null;
    }

    return (
      <div className="flex justify-center">
        <span
          onClick={() => {
            if (
              props.data.activation === 0 &&
              Number(props.data.point.replace(/,/g, ""))
            ) {
              setUserId(props.data.userId);
              setIsOpen({ deposit: false, collect: true });
            } else if (
              !Number(props.data.point.replace(/,/g, "")) &&
              props.data.activation === 0
            ) {
              Swal.fire(
                "회수할 수 있는\n포인트가 남아있지 않습니다.",
                "",
                "error",
              );
            } else {
              Swal.fire(
                "현재 지원되지 않는 기능입니다.",
                "회원 상태를 활성화한 후 이용해 주세요.",
                "error",
              );
            }
          }}
          className="bg-red hover:bg-redHover text-white cursor-pointer px-3 rounded-[5px]"
        >
          회수하기
        </span>
      </div>
    );
  };

  const emptyRows: EmployeeListType[] = Array.from(
    { length: EMPTY_ROW_COUNT },
    (_, index) => ({
      id: index + 1,
      uid: "",
      name: "",
      phone: "",
      email: "",
      point: "",
      activation: 0,
      userId: 0,
    }),
  );

  const rowDefs =
    tableData.length < EMPTY_ROW_COUNT
      ? [...tableData, ...emptyRows.slice(tableData.length)]
      : tableData;

  const columnDefs: ColDef<EmployeeListType>[] = [
    {
      headerName: "순번",
      field: "id",
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      headerName: "사원명",
      field: "name",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "사원번호",
      field: "uid",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "이메일",
      field: "email",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "휴대폰번호",
      field: "phone",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "잔여포인트",
      field: "point",
      sortable: true,
      filter: true,
      width: 250,
      cellRenderer: PointRenderer,
    },
    {
      headerName: "입금하기",
      width: 100,
      cellRenderer: SendRenderer,
    },
    {
      headerName: "회수하기",
      width: 100,
      cellRenderer: CollectRenderer,
    },
    {
      headerName: "상태변경",
      width: 100,
      cellRenderer: ActiveRenderer,
    },
  ];

  // 사원정보 가져오기
  const getEmployee = async (page: number) => {
    const params = {
      searchFilter: "",
      companyId,
      adminId,
      page,
      size: 15,
    };
    try {
      const res = await axios.get("/api/admin/company/v3/employee", {
        params,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTotalPage(res.data.resultData.totalPageCount);

      console.log(res);

      // 폰번호 하이픈 추가
      const formatPhoneNumber = (value: string) => {
        if (!value) return ""; // 빈 값 예외 처리
        value = value.replace(/\D/g, ""); // 숫자만 남기기
        if (value.length <= 3) return value;
        if (value.length <= 7) return `${value.slice(0, 3)}-${value.slice(3)}`;
        return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
      };

      // `id`가 없는 데이터를 index + 1로 추가
      const formattedData = res.data.resultData.employeeList.map(
        (item: Omit<EmployeeListType, "id">, index: number) => ({
          ...item,
          point: `${item.point.toLocaleString()}`,
          phone: formatPhoneNumber(item.phone),
          id: index + 1, // 인덱스를 기반으로 ID 추가
        }),
      );
      console.log("이거 먼데", formattedData);

      setData(formattedData);
    } catch (error) {
      console.log(error);
    }
  };

  // 포인트
  const getPoint = async () => {
    const params = { companyId, date };
    try {
      const res = await axios.get(
        "/api/admin/company/dashboard/v3/Transaction",
        {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      sessionStorage.setItem("point", res.data.resultData.currentPoint);
      setPoint(res.data.resultData.currentPoint.toLocaleString());
    } catch (error) {
      console.log(error);
    }
  };

  // 포인트 입금
  const patchPoint = async () => {
    const data = {
      userId,
      pointAmount: Number(pointAmount),
    };
    try {
      await axios.patch("/api/admin/company/v3/point/user", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      getEmployee(1);
      Swal.fire({
        title: "포인트 입금에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
        showConfirmButton: true,
        allowOutsideClick: false,
      }).then(result => {
        if (result.isConfirmed) {
          getPoint();
          setPointAmount("");
        }
      });
      setIsOpen({ deposit: false, collect: false });
    } catch (error: any) {
      Swal.fire(
        "포인트 입금에 실패하였습니다.",
        `${error.response.data.resultMsg}`,
        "error",
      );
      console.log(error);
    }
  };

  // 포인트 회수
  const patchPointCollect = async () => {
    const data = {
      userId,
      point: Number(pointAmount),
      adminId,
    };
    try {
      await axios.patch("/api/admin/company/v3/employee/point/collect", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      getEmployee(1);
      Swal.fire({
        title: "포인트 회수에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
        showConfirmButton: true,
        allowOutsideClick: false,
      }).then(result => {
        if (result.isConfirmed) {
          getPoint();
          setPointAmount("");
        }
      });
      setIsOpen({ deposit: false, collect: false });
    } catch (error: any) {
      Swal.fire(
        "포인트 회수에 실패하였습니다.",
        `${error.response.data.resultMsg}`,
        "error",
      );
      console.log(error);
    }
  };

  // 사원 활성화 / 비활성화
  const patchEmployee = async (
    userId: number,
    name: string,
    active: number,
  ) => {
    const data = {
      adminId,
      userId,
      activation: active === 0 ? 1 : 0,
    };
    try {
      const res = await axios.patch("/api/admin/company/v3/employee", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res);
      Swal.fire({
        title: `${name}님의 상태가 변경되었습니다.`,
        icon: "success",
        confirmButtonText: "확인",
        showConfirmButton: true,
        allowOutsideClick: false,
      }).then(result => {
        if (result.isConfirmed) {
          getPoint();
        }
      });
      getEmployee(1);
    } catch (error) {
      console.log(error);
    }
  };

  // antDesign
  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement,
  ) => {
    if (type === "prev") {
      return <a>{`<`}</a>;
    }
    if (type === "next") {
      return <a>{`>`}</a>;
    }
    return originalElement;
  };

  const handlePageChange = (page: number) => {
    getEmployee(page);
  };

  useEffect(() => {
    getEmployee(1);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-bold">사원 목록</h1>
      <div className="ag-theme-alpine text-center">
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowDefs}
          domLayout="print"
          modules={[ClientSideRowModelModule]}
          theme={"legacy"}
        />
      </div>
      <div className="flex justify-center">
        <Pagination
          total={totalPage * 15}
          itemRender={itemRender}
          showSizeChanger={false}
          onChange={handlePageChange}
          pageSize={15}
        />
      </div>

      {/* 입금 모달 */}
      {isOpen.deposit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold flex justify-center mb-5">
              포인트 입금
            </h2>
            <div className="flex gap-5">
              <input
                type="number"
                className="w-[250px] border border-darkGray px-2 rounded-[5px]"
                placeholder="입금할 포인트 금액을 입력해주세요."
                value={pointAmount}
                onChange={e => setPointAmount(e.target.value)}
              />
              <button
                type="button"
                onClick={() => patchPoint()}
                className="px-4 py-2 rounded-[5px] bg-lightGreen hover:bg-green text-white"
              >
                입금하기
              </button>
            </div>
            <div className="absolute top-0 right-0 flex justify-end mt-3 mr-3">
              <button
                className="text-black w-5 h-5"
                onClick={() => {
                  setIsOpen({ deposit: false, collect: false });
                  setPointAmount("");
                }}
              >
                <IoMdClose className="w-full h-full" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회수 모달 */}
      {isOpen.collect && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold flex justify-center mb-5">
              포인트 회수
            </h2>
            <div className="flex gap-5">
              <input
                type="number"
                className="w-[250px] border border-darkGray px-2 rounded-[5px]"
                placeholder="회수할 포인트 금액을 입력해주세요."
                value={pointAmount}
                onChange={e => setPointAmount(e.target.value)}
              />
              <button
                type="button"
                onClick={() => patchPointCollect()}
                className="px-4 py-2 rounded-[5px] bg-red hover:bg-redHover text-white"
              >
                회수하기
              </button>
            </div>
            <div className="absolute top-0 right-0 flex justify-end mt-3 mr-3">
              <button
                className="text-black w-5 h-5"
                onClick={() => {
                  setIsOpen({ deposit: false, collect: false });
                  setPointAmount("");
                }}
              >
                <IoMdClose className="w-full h-full" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployeeList;
