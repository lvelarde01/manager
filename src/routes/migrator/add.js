import React,{useContext,useRef,useState} from 'react'
import {useLoaderData,useNavigate, Form,redirect} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {startUp} from '../../requests/users';
import {ActionFetch} from '../../requests/container';
import {schema_collection} from '../../requests/rules'
import AlertMessage from '../../assets/alertmessage';
import * as XLSX from 'xlsx';



export async function loader({ request }) {
  const FetchContainer =  ActionFetch({fieldsObj:{_id:true,name:true}},'/api/container/list');
  let resultFetch = await FetchContainer;
  let allContainers = Object.values(resultFetch);
  return {allContainers};
}
    
export function Add() {
  const {Auth} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});
  const [dataTable,setDataTable] = useState({});
  const [dateVps,setDateVps] = useState("");
  const [vps,setVps] = useState("");

  const inputFileRef = useRef({});

  const dataInfo = useLoaderData();
  const navigate = useNavigate();
  let fields = {
    "A":{key:"po_number",value:"PO No",show:false},
    "B":{key:"bale_number",value:"Bale No",show:false},
    "C":{key:"rug_id",value:"Rug ID",show:true},
    "D":{key:"upc",value:"UPC",show:true},
    "L":{key:"collection",value:"COLLECTION",show:true},
    "E":{key:"stock_id",value:"Stock ID",show:false},
    "F":{key:"type",value:"Type",show:true},
    "G":{key:"description",value:"Description",show:false},
    "H":{key:"size",value:"Size",show:true},
    "I":{key:"customer",value:"Customer",show:false},
    "J":{key:"qrdq",value:"ORDQ",show:true},
    "K":{key:"shpd",value:"SHPD",show:true},
    "Z":{key:"scaned",value:"SCANED",show:true},
    "W":{key:"status",value:"STATUS",show:true},


  }
  let fieldsStockID = {
    "A":{key:"po_number",value:"PO No",show:false},
    "B":{key:"bale_number",value:"Bale No",show:false},
    "C":{key:"rug_id",value:"Rug ID",show:true},
    "D":{key:"upc",value:"UPC",show:true},
    "L":{key:"collection",value:"COLLECTION",show:true},
    "E":{key:"stock_id",value:"Stock ID",show:true},
    "F":{key:"type",value:"Type",show:true},
    "G":{key:"description",value:"Description",show:false},
    "H":{key:"size",value:"Size",show:true},
    "I":{key:"customer",value:"Customer",show:false},
    "J":{key:"qrdq",value:"ORDQ",show:true},
    "K":{key:"shpd",value:"SHPD",show:true},
  }

  const handlerOnchange = (event)=>{
    const nameField = event.target.name; 
    if(event.currentTarget.type==='text'){
      let value =event.currentTarget.value;
      event.currentTarget.value=value.toUpperCase();
    }  
    const {[nameField]:cpNameField,...cpErrors} = {...errors};
    if(cpNameField){ 
      setErrors({...cpErrors});
    }
  }

  const handlerOnSubmit = async (event)=>{
    event.preventDefault();
    setLoading(true);
    setFetchReady({ready:false,msgtype:'success',message:'default'});
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    
    const {error,dataUserObj} = await startUp({data,schema:schema_collection});
    if(Object.entries(error).length > 0){
        setTimeout(()=>{
          setFetchReady({ready:true,msgtype:'danger',message:''});
          setErrors({...error});
          setLoading(false);
        },3000);
        return;
    }
    console.log("NO ERRORS");
    const result = await ActionFetch({...dataUserObj},'/api/collection/add');
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se guardo correctamente.'});
        setLoading(false);
        event.target.name.value = '';
      },3000);
    }else{
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'danger',message:'Se presento un problema, Por favor, verifique e intente de nuevo.'});
        setLoading(false);
        setErrors({...result});
      },3000);
    }
  }
  const getDataExcelByRow = ({data={},range})=>{
    let RageArray = data["!ref"].split(":");
    let RageStart = RageArray[0].replace(/^\D+/g, '') ;
    let RageFinish = RageArray[1].replace(/^\D+/g, '') ;
    let stockIDs = [];
    let NormalRows = [];
    let vpsFix = (data["D6"]?.w || "").replace(/[^0-9.]/g,'');
    let date = new Date(data["G7"]?.w);
    let dateFix = date.getFullYear() + '-' + (date.getMonth()+1).toString().padStart(2, "0") + '-' + date.getDate().toString().padStart(2, "0");
    console.log(dateFix);
    setVps(vpsFix);
    setDateVps(dateFix);

    RageFinish = Number(RageFinish) -2;
    for (let indexPosition = 10; indexPosition < RageFinish; indexPosition++) {
      let dataRowCurrent = {};
      let checkStockID = false;
      for (let LetterKey in fields) {
        const letter = LetterKey+indexPosition;
        const fieldCurrent = fields[LetterKey].key;

        if(LetterKey === "E" && data[letter]?.w){
          console.log("STOCK")
          checkStockID=true;
        }
        dataRowCurrent[fieldCurrent] = data[letter]?.w || "";
      }
      !checkStockID? NormalRows.push(dataRowCurrent) : stockIDs.push(dataRowCurrent) ;
    }
    let consolidateStockIDs = stockIDs.map((value)=>{
      const collection = value.rug_id.split('-'); 
      value.collection = collection.length === 1 ? value.rug_id.slice(0,-10):collection[0];
      let upc = value.upc;
      value.upc = upc.slice(6,-1);
      let size = value.size.slice(0,2);
      value.size = size.replace(/[^0-9.]/g,'');;
      return value;
    });
    let normalRowConsolidate = NormalRows.map((value)=>{
      const collection = value.rug_id.split('-'); 
      value.collection = collection[0];
      let upc = value.upc;
      value.upc = upc.slice(6,-1);
      return value; 
    });
    normalRowConsolidate = NormalRows.reduce((acc,current)=>{
      const {shpd,upc,...rest} = current;

      let upc_acc = acc.find(value => value.upc === upc); 
      let acc_filter = acc.filter(value => value.upc !== upc);
      if(upc_acc){
        upc_acc.shpd = Number(upc_acc.shpd) + Number(shpd);
      return [...acc_filter,{...upc_acc}];
      }
      return [...acc,{...current}];
    },[]);
    //console.warn(range.replace(/^\D+/g, ''))
    return {stocks:normalRowConsolidate,stockids:consolidateStockIDs};
  }
  const onFilechange = async(event) => {
    const dataFileObj = event.currentTarget.files[0];
    if(!dataFileObj)return;
    const data = await dataFileObj.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheetName = workbook.SheetNames[0];
    let sheet = workbook.Sheets[firstSheetName];
    let range = XLSX.utils.decode_range(sheet['!ref']); // get the range
    const result = getDataExcelByRow({data:sheet,range:"G7"});
    setDataTable(result);

  }
  const handlerTriggerUpload = ()=>{
    inputFileRef.current.click();
  }
  const handlerClearAll= ()=>{
    setDataTable({});
    setDateVps("");
    setVps("");
    inputFileRef.current.value = '';
  }


  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
        <Form className='col-12 mt-3' method='post' onSubmit={handlerOnSubmit} >
      <fieldset>
      <div className="mb-2">
          <button type="button" className="btn btn-primary float-start" disabled={loading} onClick={()=>{navigate('/migrator/')}} ><i className='fas fa-arrow-rotate-left me-2'></i>BACK</button>
        </div>
      <div className="mb-3">
        <h2>CARGA DE VPS</h2>
      </div>
        <legend>INFORMACION</legend>
        <div className="mb-3">
            <select className="form-select" name='worker_id' required onChange={handlerOnchange} >
              <option value={""}>SELECT CONTAINER</option>
              {dataInfo.allContainers.map((value)=>(
                <option key={value._id} value={value._id}>{value.name}</option>
              ))}
              </select>
          {errors?.worker_id && <p className='text-center text-danger mx-1 mt-1' >*{errors.worker_id}*</p>}
        </div>
        <div className="mb-3">
          <input type="text" name='vps' value={vps}  className="form-control" required placeholder="VPS-XXXXX" onChange={handlerOnchange}/>
          {errors?.name && <p className='text-center text-danger mx-1 mt-1' >*{errors.name}*</p>}
        </div>
        <div className="mb-3">
          <input type="date" name='name' value={dateVps} className="form-control" required placeholder="DATE ARRIVE" onChange={handlerOnchange}/>
          {errors?.name && <p className='text-center text-danger mx-1 mt-1' >*{errors.name}*</p>}
        </div>

        
            <div className="d-grid gap-2 mb-3">
            <input
              type="file"
              name='fileExcel'
              ref={inputFileRef}
              style={{"display":'none'}}
              accept={".xls, .xlsx"}
              onChange={onFilechange}
            />
            {Object.keys(dataTable).length === 0 ?<> <button type="button" className="btn btn-primary btn-block " onClick={handlerTriggerUpload} ><i className='fas fa-cloud-upload me-2' ></i>UPLOAD VPS</button></>:<><button type="button" className="btn btn-danger btn-block " onClick={handlerClearAll} ><i className='fas fa-trash me-2' ></i>DELETE VPS</button></>}
            </div>
          
      </fieldset>
    </Form>
    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
    <li className="nav-item" role="presentation">
      <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">CONSOLIDATE ({`${dataTable?.stocks?.length ?? 0 }`})</button>
    </li>
    <li className="nav-item" role="presentation">
      <button className="nav-link btn-block" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">CONSOLIDATE STOCK ID ({`${dataTable?.stockids?.length ?? 0 }`}) </button>
    </li>
  </ul>
  <div className="tab-content" id="pills-tabContent">
    <div className="tab-pane fade show active " id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
    
    <div style={{overflowY:"scroll",height:"400px"}} className='table-responsive overflow-y-visible'>
    <table className='table  table-bordered'>
      <thead>
        <tr>
        {
          Object.entries(fields).map((valueLetter,keyLetter)=>(
            valueLetter[1].show&&<th key={keyLetter} >{valueLetter[1].value}</th> 
          )
          )
          }
        </tr>
      </thead>
            <tbody>
              {dataTable?.stocks?.map((value,index)=>(
                <tr key={index}>
                    {
                    Object.entries(fields).map((valueLetter,keyLetter)=>(
                      valueLetter[1].show&&<td key={keyLetter} >{value[valueLetter[1].key]}</td> 
                    )
                    )
                    }
                </tr>
              ))}
              
            </tbody>
    </table>
    </div>

    </div>
    <div className="tab-pane fade show" id="pills-profile" role="tabpanel" aria-labelledby="pills-home-tab">
          
    <div style={{overflowY:"scroll",height:"400px"}} className='table-responsive overflow-y-visible'>
    <table className='table  table-bordered'>
      <thead>
        <tr>
        {
          Object.entries(fieldsStockID).map((valueLetter,keyLetter)=>(
            valueLetter[1].show&&<th key={keyLetter} >{valueLetter[1].value}</th> 
          )
          )
          }
        </tr>
      </thead>
            <tbody>
              {dataTable?.stockids?.map((value,index)=>(
                <tr key={index}>
                    {
                    Object.entries(fieldsStockID).map((valueLetter,keyLetter)=>(
                      valueLetter[1].show&&<td key={keyLetter} >{value[valueLetter[1].key]}</td> 
                    )
                    )
                    }
                </tr>
              ))}
              
            </tbody>
    </table>
    </div>

    </div>
  </div>
    </div>
    </div>
  )
}
