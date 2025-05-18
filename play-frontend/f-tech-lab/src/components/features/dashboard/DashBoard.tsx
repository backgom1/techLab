import {dashBoardService} from "./DashBoardService.ts";

const DashBoard = () =>{

  const promise = dashBoardService.list();
    console.log(promise);

    return <div>promise</div>
}

export default DashBoard;