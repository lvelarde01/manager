import React,{useContext,useState} from 'react'
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
    
export function Addfixed() {
  const {Auth} = useContext(AuthContext);
  const [loading,setLoading] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [errors,setErrors] = useState({});
  const [dataTable,setDataTable] = useState({});
  const [dataTableCompare,setDataTableCompare] = useState([]);
  const [MatchConsolidate,setMatchConsolidate] = useState([]);
  const [MatchCompare,setMatchCompare] = useState([]);




  const dataInfo = useLoaderData();
  const navigate = useNavigate();
  let fields = {
    "D":{key:"location",value:"LOCATION ORIGINAL",show:true},
    "H":{key:"upc",value:"UPC",show:true},
    "I":{key:"rug_id",value:"Rug ID",show:true},
    "K":{key:"scaned",value:"SCANED",show:true},
    "L":{key:"total",value:"TOTAL",show:false},
    "J":{key:"qty",value:"TOTAL",show:true},
    "M":{key:"status",value:"ESTATUS",show:true},
  }
  let fieldsCompare = {
    "A":{key:"upc",value:"UPC",show:true},
    "B":{key:"qty",value:"Qty",show:true},
  }

  const getDataExcelByRowCompare = ({data={},range,fieldList={}})=>{
    let RageArray = data["!ref"].split(":");
    let RageStart = RageArray[0].replace(/^\D+/g, '') ;
    let RageFinish = RageArray[1].replace(/^\D+/g, '') ;
    let stockIDs = [];
    let NormalRows = [];
    
    RageFinish = Number(RageFinish) -1;
    for (let indexPosition = 1; indexPosition < RageFinish; indexPosition++) {
      let dataRowCurrent = {};
      for (let LetterKey in fieldList) {
        const letter = LetterKey+indexPosition;
        const fieldCurrent = fieldList[LetterKey].key;
        if(!data[letter]?.w)continue;
        dataRowCurrent[fieldCurrent] = data[letter]?.w || "";
      }
      if(Object.keys(dataRowCurrent).length ===0) continue;
      NormalRows.push(dataRowCurrent) ;
    }
    //console.warn(range.replace(/^\D+/g, ''))
    return NormalRows;
  }
  const getDataExcelByRow = ({data={},range,fieldList={}})=>{
    let RageArray = data["!ref"].split(":");
    let RageStart = RageArray[0].replace(/^\D+/g, '') ;
    let RageFinish = RageArray[1].replace(/^\D+/g, '') ;
    let stockIDs = [];
    let NormalRows = [];
    
    RageFinish = Number(RageFinish) -1;
    for (let indexPosition = 2; indexPosition < RageFinish; indexPosition++) {
      let dataRowCurrent = {};
      for (let LetterKey in fieldList) {
        const letter = LetterKey+indexPosition;
        const fieldCurrent = fieldList[LetterKey].key;
        dataRowCurrent[fieldCurrent] = data[letter]?.w || "";
      }
      NormalRows.push(dataRowCurrent) ;
    }
    const normalRowConsolidate = NormalRows.reduce((acc,current)=>{
      const {qty,upc,location,...rest} = current;
      let upc_acc = acc.find(value => value.upc === upc); 
      let acc_filter = acc.filter(value => value.upc !== upc);
      if(upc_acc){
        upc_acc.qty = Number(upc_acc.qty) + Number(qty);
        let location_array = upc_acc?.location?.replaceAll(/\s/g,'').split(',') || null; 
        if(location_array && !location_array?.includes(location)){
            upc_acc.location = upc_acc.location + `, ` + location;
        }
      return [...acc_filter,{...upc_acc}];
      }
      return [...acc,{...current}];
    },[]);
    //console.warn(range.replace(/^\D+/g, ''))
    return {stocks:normalRowConsolidate,stockids:stockIDs};
  }
  const handlerUpload = async (event)=>{
    let dataReceive = event.currentTarget.files[0];
    const data = await dataReceive.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheetName = workbook.SheetNames[0];
    let sheet = workbook.Sheets[firstSheetName];
    let range = XLSX.utils.decode_range(sheet['!ref']); // get the range
    const result = getDataExcelByRow({data:sheet,range:"G7",fieldList:fields});
    setDataTable(result);
    console.log(sheet);
    console.log(range);
    //console.log(workbook);

  }
  const handlerUploadMatch = async (event) =>{
    let dataReceive = event.currentTarget.files[0];
    const data = await dataReceive.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheetName = workbook.SheetNames[0];
    let sheet = workbook.Sheets[firstSheetName];
    let range = XLSX.utils.decode_range(sheet['!ref']); // get the range
    const result = getDataExcelByRowCompare({data:sheet,range:"G7",fieldList:fieldsCompare});
    const seen = new Set();
    const resultUnique = result.filter(value => {
    const duplicate = seen.has(value.upc);
    seen.add(value.upc);
    return !duplicate;
    });
    setDataTableCompare(resultUnique);
    const dataFilter = JSON.parse(JSON.stringify(dataTable?.stocks ));
    const resultMatch = dataFilter.map((value)=>{
        const {upc} = value;
        const upc_match = resultUnique.find((value)=> value.upc ===upc);
        if(upc_match){
          value.scaned = Number(upc_match.qty);
            value.qty = Number(value.qty) - Number(upc_match.qty);
          }else{
          value.scaned = 0;

          }
      value.qty = value.qty < 0 ? `+${(value.qty * -1)}` :  (value.qty * -1); 
      if(value.qty >= 0){
        value.status = `POSITIVO`; 
      }else{
        value.status = 'FALTANTE'; 
      }


        return value;

    });
    setMatchConsolidate(resultMatch);
    const resultUnique_cp = JSON.parse(JSON.stringify(resultUnique ));
    const resultMatchCompare = resultUnique_cp.map((value)=>{
        const {upc} = value;
        const upc_match = dataTable?.stocks?.find((value)=> value.upc ===upc);
        if(upc_match){
            value.qty = Number(value.qty) - Number(upc_match.qty);
        }
        return value;
    });
    setMatchCompare(resultMatchCompare);
  }
  const handlerExportExcel = ()=>{
    const rows = MatchConsolidate.map((value)=>{
      const {total,...rest} = value;
      return {...rest};
    });
    /* flatten objects */
   const worksheet = XLSX.utils.json_to_sheet(rows);
   XLSX.utils.sheet_add_aoa(worksheet, [["LOCATION ORIGINAL", "UPC","Rug ID	","SCANED","TOTAL","ESTATUS"]], { origin: "A1" });
   
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, "RESULT");
   XLSX.writeFile(workbook, "consolidate scaned.xlsx", { compression: true });
   
   }


  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
        <Form className='col-12 mt-3' method='post' >
      <fieldset>
      <div className="mb-3">
        <h2>CARGA DE RETURN</h2>
      </div>
        <legend>INFORMACION</legend>

        <div className="mb-3">
          <input type="file" name='name' className="form-control" required placeholder="NAME COLLECTION" onChange={handlerUpload}/>
          {errors?.name && <p className='text-center text-danger mx-1 mt-1' >*{errors.name}*</p>}
        </div>
        {dataTable?.stocks?.length&&<div className="mb-3">
          <input type="file" name='name_compare' className="form-control" required placeholder="NAME COLLECTION" onChange={handlerUploadMatch}/>
          {errors?.name && <p className='text-center text-danger mx-1 mt-1' >*{errors.name}*</p>}
        </div>}
        <div className="mb-3">
        <button type="button" className="btn btn-primary" disabled={loading} onClick={handlerExportExcel} ><i className='fas fa-arrow-rotate-left me-2'></i>DOWNLOAD</button>

          <button type="button" className="btn btn-primary float-end" disabled={loading} onClick={()=>{navigate('/collection/')}} ><i className='fas fa-arrow-rotate-left me-2'></i>BACK</button>

        </div>
      </fieldset>
    </Form>
    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
    <li className="nav-item" role="presentation">
      <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">CONSOLIDATE</button>
    </li>
    <li className="nav-item" role="presentation">
      <button className="nav-link btn-block" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">DATA SCANED</button>
    </li>
    <li className="nav-item" role="presentation">
      <button className="nav-link btn-block" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-consolidate-match" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">CONSOLIDATE MATCH</button>
    </li>
    <li className="nav-item" role="presentation">
      <button className="nav-link btn-block" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-consolidate-match-lost" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">SCANED MATCH</button>
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
          Object.entries(fieldsCompare).map((valueLetter,keyLetter)=>(
            valueLetter[1].show&&<th key={keyLetter} >{valueLetter[1].value}</th> 
          )
          )
          }
        </tr>
      </thead>
            <tbody>
              {dataTableCompare?.map((value,index)=>(
                <tr key={index} >
                    {
                    Object.entries(fieldsCompare).map((valueLetter,keyLetter)=>(
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
    <div className="tab-pane fade show " id="pills-consolidate-match" role="tabpanel" aria-labelledby="pills-home-tab">
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
              {MatchConsolidate?.map((value,index)=>(
                <tr key={index} className = {`${value.qty<0?'table-danger':'table-primary'}`} >
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

    <div className="tab-pane fade show " id="pills-consolidate-match-lost" role="tabpanel" aria-labelledby="pills-home-tab">
    <div style={{overflowY:"scroll",height:"400px"}} className='table-responsive overflow-y-visible'>
    <table className='table  table-bordered'>
      <thead>
        <tr>
        {
          Object.entries(fieldsCompare).map((valueLetter,keyLetter)=>(
            valueLetter[1].show&&<th key={keyLetter} >{valueLetter[1].value}</th> 
          )
          )
          }
        </tr>
      </thead>
            <tbody>
              {MatchCompare?.map((value,index)=>(
                <tr key={index} className = {`${value.qty<0?'table-danger':'table-primary'}`}>
                    {
                    Object.entries(fieldsCompare).map((valueLetter,keyLetter)=>(
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
