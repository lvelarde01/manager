import React,{useContext, useEffect, useState,useRef} from 'react'
import AuthContext from '../../context/auth-context';
import ThemeContext from '../../context/theme-context';
import MessageContext from '../../context/message-context';
import {Link,useLoaderData} from 'react-router-dom';
import AlertMessage from '../../assets/alertmessage';
import {ActionFetch} from '../../requests/container';
import {CountHours,FixHours,getTimeCount} from '../../requests/users';
import Newmodal from '../../assets/newmodal';
//import { read, writeFileXLSX,XLSX } from "xlsx";
import * as XLSX from 'xlsx';

export async function loader({ request }) {
  const FetchCalenar =  ActionFetch({},'/api/calendars/list');
  const FetchWorkers =  ActionFetch({},'/api/workers/list');
  const FetchDeparments =  ActionFetch({},'/api/departments/list');

  let resultFetch = await FetchCalenar;
  let resultFetchWorker = await FetchWorkers;
  let resultFetchDeparment = await FetchDeparments;

  
  const dataWorkerObj = Object.values(resultFetchWorker).reduce((acc,current)=>{
    let values = {[current._id]:current.name};
    return {...acc,...values};
  },{});
  const dataDeparmentObj = Object.values(resultFetchDeparment).reduce((acc,current)=>{
    let values = {[current._id]:current.name};
    return {...acc,...values};
  },{});

  console.log(dataDeparmentObj);

  const allCalendar = Object.values(resultFetch).reduce((acc,current)=>{
    let {worker_id,department_id,date_register,...rest} = current;
    let date_register_array = date_register.split('-');
    date_register = date_register_array[1]+'/'+ date_register_array[2] + '/'+date_register_array[0];
    let date_register_time = new Date(Number(date_register_array[0]),Number(date_register_array[1])-1,Number(date_register_array[2])).getTime();

    worker_id = dataWorkerObj[worker_id] || 'Sin Registro o eliminado';
    department_id = dataDeparmentObj[department_id] || 'Sin Registro o eliminado';

    return [...acc,{worker_id,department_id,date_register,date_register_time,...rest}];
  },[]);
    return {allCalendar,dataWorkerObj,dataDeparmentObj};
    }


export function Index() {
  const {Auth,handlerAuth} = useContext(AuthContext);
  const {theme,handlerTheme} = useContext(ThemeContext);
  const {Message,handlerMessage} =  useContext(MessageContext);
  const dataInfo = useLoaderData();
  const [loading,setLoading] = useState(false);
  const [dataRow,setDataRow] = useState(dataInfo.allCalendar);
  const [deleteAll,setDeleteAll] = useState({});
  const [deleting,setDeleting] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [q, setQ] = useState("");
  const [dataRowFilter,setDatarowFilter] = useState([]);
  const [conditionsFilter,setConditionsFilter] = useState({});


  //use ref
  const selectInputRef = useRef([]);

  const handlerClearFilter = ()=>{
    selectInputRef.current['department_id'].value="";
    selectInputRef.current['worker_id'].value="";
    selectInputRef.current['from'].value="";
    selectInputRef.current['to'].value="";
    setConditionsFilter({});
  }


  const handlerOnchangeFilter = async(Event) =>{

    const key =  Event.currentTarget.name;
    let value = null;
    let dateTime = null;
    if(key === 'from' || key === 'to'){
      dateTime =  Event.currentTarget.value.split('-');
      value = new Date(Number(dateTime[0]),Number(dateTime[1])-1,Number(dateTime[2])).getTime();
    }else{
      value =  Event.currentTarget?.value;
    }
    const {[key]:value_cp,...conditionsFilter_cp} = {...conditionsFilter};
    if(value){
      setConditionsFilter({...conditionsFilter_cp,[key]:value});
    }else{
      setConditionsFilter({...conditionsFilter_cp});
    }
  } 
  const handlerSearchBTN = ()=>{
    console.log('CLICK');
    handlerSearch('');

  }

  const handlerSearch = async(value)=>{
    if(!value && Object.keys(conditionsFilter).length === 0){
      setDatarowFilter([]);
      return;
    }
    let query = value.toLocaleLowerCase() || null;
    let dataFilter = dataRow.filter((data)=>{
      if(Object.keys(conditionsFilter).length > 0){
        
        for (const key in conditionsFilter) {
          if (key !=='from' && key !=='to' && data[key].toLocaleLowerCase() !== conditionsFilter[key].toLocaleLowerCase()) {
            return false;
          }
        }
        if(conditionsFilter.hasOwnProperty('from') && conditionsFilter.hasOwnProperty('to') && (conditionsFilter['from'] > data['date_register_time'] || conditionsFilter['to'] < data['date_register_time']) ){
          return false
        }
        if(conditionsFilter.hasOwnProperty('from') && !conditionsFilter.hasOwnProperty('to') && conditionsFilter['from'] !== data['date_register_time']){
          return false
        }
        if(query && !data.worker_id.toLocaleLowerCase().includes(query)){
          return false;
        }

        return data;
      }else if(data.worker_id.toLocaleLowerCase().includes(query)){
        console.log("QUERY STANDAR");
        return data
      }
      return false;
    });
    setDatarowFilter(dataFilter);
  }
  const handlerEdit = async(event)=>{
    if(!window.confirm('Desea ir a modificar el registro ?')){
      event.preventDefault();
      return;
    }
    
  }
  const handlerDeleteAll = async(event)=>{
    event.preventDefault();
    if(!window.confirm('Desea Eliminar todos los Registros seleccionados ?')){
      return;
    }
    setDeleting(true);
    const result = await ActionFetch(deleteAll,'/api/calendars/trashall');
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se Elimino correctamente.'});
        const dataRowFilter = dataRow.length > 1 ? dataRow.filter((data)=>deleteAll.hasOwnProperty(data._id)=== false) : [];
        setDataRow(dataRowFilter);
        setDeleting(false);
        setDeleteAll({});

      },3000);
    }else{
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'danger',message:'Se presento un problema, Por favor, verifique e intente de nuevo.'});
        setDeleting(false);
      },3000);
    }
    
  }
  const handlerCheck = async(event)=>{
    const _id = event.currentTarget.value || null;
    if(!_id)return;
    if(event.currentTarget.checked){
      setDeleteAll({...deleteAll,[_id]:'_id'});
    }else{
      let deleteAllCopy = {...deleteAll};
      delete deleteAllCopy[_id];
      setDeleteAll({...deleteAllCopy});
    }

  }
  const handlerCheckAll = async(event)=>{
    if(event.currentTarget.checked){
       let dataRowCopy = [...dataRow];
      let result = dataRowCopy.reduce((key,index,array)=>{
        return {...key,[index._id]:'_id'}
      },{});
      setDeleteAll(result);
    }else{
      setDeleteAll({});
    }
  }

  const handlerTrash = async(event)=>{
    event.preventDefault();
    if(!window.confirm('Desea Eliminar Este Registro ?')){
      return;
    }
    setLoading(true);
    const _id = event.currentTarget.id;
    let dataRowCopy = [...dataRow];
    dataRowCopy = dataRow.map((value)=>{
      if(value._id === _id){
        value.edit=true;
      }
      return value;
    });
    setDataRow(dataRowCopy);
    let result = await ActionFetch({_id},'/api/collection/trash');
    if(result.acknowledged){
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se Elimino correctamente.'});
        const dataRowFilter = dataRow.length > 1 ? dataRow.filter((data)=>data._id !==_id) : [];
        setDataRow(dataRowFilter);
        setLoading(false);
      },3000);
    }else{
      setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'danger',message:'Se presento un problema, Por favor, verifique e intente de nuevo.'});
        setLoading(false);
      },3000);
    }
    
  }

  const dataRowShow = q.length > 0 || Object.keys(conditionsFilter).length > 0  ? dataRowFilter : dataRow;
  
  const countStart = getTimeCount(dataRowShow,'worker_start_hour','worker_start_min');
  const countFinish = getTimeCount(dataRowShow,'worker_finish_hour','worker_finish_min');
  const countHoursResult = CountHours(countStart.countH,countStart.countM,countFinish.countH,countFinish.countM);


dataRowShow.sort(function (a, b) {
  if (a.date_register_time > b.date_register_time) {
    return 1;
  }
  if (a.date_register_time < b.date_register_time ) {
    return -1;
  }
  if (a.worker_id.toLocaleLowerCase() > b.worker_id.toLocaleLowerCase()) {
    return 1;
  }
  if (a.worker_id.toLocaleLowerCase() < b.worker_id.toLocaleLowerCase() ) {
    return -1;
  }
  return 0;
});


const handlerExportExcel = ()=>{
const dataRowShow = q.length > 0 || Object.keys(conditionsFilter).length > 0  ? dataRowFilter : dataRow;
dataRowShow.sort(function (a, b) {
  if (a.date_register_time > b.date_register_time) {
    return 1;
  }
  if (a.date_register_time < b.date_register_time ) {
    return -1;
  }
  if (a.worker_id.toLocaleLowerCase() > b.worker_id.toLocaleLowerCase()) {
    return 1;
  }
  if (a.worker_id.toLocaleLowerCase() < b.worker_id.toLocaleLowerCase() ) {
    return -1;
  }
  return 0;
});

/* coun hours */
const count = dataRowShow.reduce((acc,current)=>{
  let allTime = CountHours(current.worker_start_hour,current.worker_start_min,current.worker_finish_hour,current.worker_finish_min).split(':');
let work_hourCurrent= Number(allTime[0]);
let work_minCurrent= Number(allTime[1]);

const work_hourAcc = acc.work_hour || 0; 
const work_minAcc = acc.work_min || 0;

work_hourCurrent= work_hourCurrent + work_hourAcc;
work_minCurrent= work_minCurrent + work_minAcc;

return {
work_hour:work_hourCurrent,
work_min:work_minCurrent,
}
},{});

while (count.work_min >= 60) {
count.work_min=count.work_min - 60;
count.work_hour=count.work_hour + 1;
}

 /* flatten objects */
 const rows = dataRowShow.map((row) => {
    return { 
  worker: row.worker_id,
  department: row.department_id,
  date_register: row.date_register,
  time_start: FixHours(row.worker_start_hour,row.worker_start_min),
  time_finish: FixHours(row.worker_finish_hour,row.worker_finish_min),
  time_worker: CountHours(row.worker_start_hour,row.worker_start_min,row.worker_finish_hour,row.worker_finish_min),
  }});
const worksheet = XLSX.utils.json_to_sheet(rows);
//header
const max_width = dataRowShow.reduce((w, r) => Math.max(w, r.worker_id.length), 10);

worksheet["!cols"] = [ { wch: max_width },{ wch: max_width },{ wch: max_width },{ wch: max_width },{ wch: max_width },{ wch: max_width } ];
//
const tfootRow =Number(rows.length)+2;
XLSX.utils.sheet_add_aoa(worksheet, [["NAME / SURNAME", "DEPARTMENT","DATE","TIME START","TIME FINISH","TIME WORKER HRS"]], { origin: "A1" });
XLSX.utils.sheet_add_aoa(worksheet, [["", "","","","TOTAL HOUR(s)",`${String(count?.work_hour || 0).padStart(2,'0')}:${String(count?.work_min || 0).padStart(2,'0')}`]], { origin: "A"+tfootRow });

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "RESULT");
XLSX.writeFile(workbook, "Workers.xlsx", { compression: true });

}
  
 
  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {Message.ready && (<AlertMessage sizeClass={"col-12 ms-3 mt-3"} message={Message.message} msgtype={Message.msgtype} typeAlert={"custom"} />) }
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
      
      <div className='row ms-3 mt-3 block-radius-style'>
      <div className='col-6 mb-3 mt-3 ms-5'>
        <input type={'text'} placeholder={'SEARCH BY NAME OR SURNAME'} name={'query'} className={'form-control'} value={q} onChange={(e)=>{handlerSearch(e.currentTarget.value);setQ(e.currentTarget.value)}} />
      </div>
      
      <div className='col-4 mb-3 mt-3 '>
        <button className='btn btn-primary'><i className='fas fa-search me-2'></i>Buscar</button>
        <button className='btn btn-primary' type='button' data-bs-toggle="modal" data-bs-target="#settingModal" ><i className='fas fa-filter me-2'></i>FILTER</button>
        <button className='btn btn-primary' onClick={handlerExportExcel} ><i className='fas fa-file-export me-2'></i>Exportar</button>
        <button className={`btn btn-primary ${Object.keys(deleteAll).length === 0 || deleting ? 'disabled':''} ` } onClick={handlerDeleteAll} >
        {deleting ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Eliminando..</span></>  : <><i className='fas fa-trash me-2'></i>Eliminar ( {Object.keys(deleteAll).length} )</> }
          </button>
      </div>
      <h2>RESULT SEARCH</h2>
      <Newmodal title={'FILTER SEARCHED'} startModal={true} handlerActionAccept={handlerSearchBTN} handlerActionReset={handlerClearFilter} >
      <div className='row'>
          <div className="col mb-3">
              <label>DEPARTMENT</label>
              <select ref={el => selectInputRef.current['department_id'] = el} className="form-select" name='department_id' required onChange={handlerOnchangeFilter} >
              <option value={""}>ALL</option>
              {Object.values(dataInfo?.dataDeparmentObj).map((value)=>(
              <option key={value} value={value}>{value}</option>
              ))} 
                
              </select>
        </div>
        <div className="col-12 mb-3">
        <label>NAME / SURNAME</label>
          <select ref={el => selectInputRef.current['worker_id'] = el} className="form-select" name='worker_id' required  onChange={handlerOnchangeFilter} >
              <option value={""}>ALL</option>
              {Object.values(dataInfo?.dataWorkerObj).map((value)=>(
              <option key={value} value={value}>{value}</option>
              ))} 
            </select>
          </div>
          <div className="col-12 mb-3">
            <label>FROM</label>
          <input type="date" ref={el => selectInputRef.current['from'] = el} name='from' max={selectInputRef.current['to']?.value || ''} className="form-control" required placeholder="DESDE"  onChange={handlerOnchangeFilter}  />
        </div>
        <div className="col-12 mb-3">
          <label>TO</label>
          <input type="date" ref={el => selectInputRef.current['to'] = el} name='to' min={selectInputRef.current['from']?.value || ''}  className="form-control" required placeholder="HASTA"  onChange={handlerOnchangeFilter}/>
        </div>
      </div>    
      </Newmodal>
      <div className='table-responsive' style={{overflowY:'scroll',height:'500px'}} >
      <table className="table table-hover table-striped" >
          <thead>
            <tr>
              <th scope="col"><input disabled={dataRow.length ===0?true:false} type={'checkbox'} name={"field"} value={'as'} checked={Object.keys(deleteAll).length === dataRow.length &&  dataRow.length > 0 ? true : false} onChange={handlerCheckAll} title={'Seleccionar todos'}/></th>
              <th scope="col">NAME / SURNAME</th>
              <th scope="col">DEPARTMENT</th>
              <th scope="col">DATE</th>
              <th scope="col">TIME START</th>
              <th scope="col">TIME FINISH</th>
              <th scope="col">TIME WORKER HRS</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {dataRowShow&&dataRowShow.map((data)=>(
                <tr key={data._id}>
                <th scope="row"><input type={'checkbox'} checked={deleteAll.hasOwnProperty(data._id) ? true : false} name={"field"} value={data._id} onChange={handlerCheck}/></th>
                <td>{data.worker_id}</td>
                <td>{data.department_id}</td>
                <td>{data.date_register}</td>
                <td>{FixHours(data.worker_start_hour,data.worker_start_min)}</td>
                <td>{data?.worker_finish_hour? `${FixHours(data.worker_finish_hour,data.worker_finish_min)}` : `No Registrado`}</td>
                  <td>{data?.worker_finish_hour? CountHours(data.worker_start_hour,data.worker_start_min,data.worker_finish_hour,data.worker_finish_min) : `Sin registro de salida`}</td>
                <td><Link className={`btn btn-primary ${loading?`disabled`:``}`} onClick={handlerEdit} to={`/calendars/edit/${data._id}`}><i className='fas fa-pencil'/></Link>
                </td>

              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={6} className='text-center'>TOTAL HOUR(s)</th>
              <th>{countHoursResult}</th>

            </tr>
          </tfoot>
        </table>
        </div>
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className="page-item"><Link className="page-link btn-primary me-0" href="#">Anterior</Link></li>
            <li className="page-item"><Link className="page-link btn-primary" href="#">1</Link></li>
            <li className="page-item"><Link className="page-link btn-primary" href="#">2</Link></li>
            <li className="page-item"><Link className="page-link btn-primary" href="#">3</Link></li>
            <li className="page-item"><Link className="page-link btn-primary ms-0" href="#">Siguiente</Link></li>
          </ul>
        </nav>
        </div>
    </div>
  )
}
