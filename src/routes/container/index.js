import React,{useContext, useState,useRef} from 'react'
import AuthContext from '../../context/auth-context';
import MessageContext from '../../context/message-context';
import {Link,useLoaderData} from 'react-router-dom';
import AlertMessage from '../../assets/alertmessage';
import {ActionFetch} from '../../requests/container';
import {formatNumber,getPPL,getTimeCount,getCountContainer,FixTime,PPLAverage,resumeTimeAverage,FixHours,CountHours,TimeToNumber} from '../../requests/users';
import Newmodal from '../../assets/newmodal';
import * as XLSX from 'xlsx';


export async function loader({ request }) {
      const FetchContainer =  ActionFetch({},'/api/container/list');
      const FetchWareHouse =  ActionFetch({},'/api/warehouse/list');
      const FetchVps =  ActionFetch({},'/api/vps/list');
      const FetchCollection =  ActionFetch({ fieldsObj:{_id:true,name:true} },'/api/collection/list');
      const FetchCalenar =  ActionFetch({department_id:'6504b1cc09817a94fcd35f82'},'/api/calendars/list');



      let resultFetch = await FetchContainer;
      let resultWareHouse = await FetchWareHouse;
      let resultVps = await FetchVps;
      let resultCollection = await FetchCollection;
      let resultCalenar = await FetchCalenar;

      const dataCollectionObj = Object.values(resultCollection).reduce((acc,current)=>{
        let values = {[current._id]:current.name};
        return {...acc,...values};
      },{});

      resultVps = Object.values(resultVps).reduce((acc,current)=>{
        let {collection_id,...rest} = current;
        //colection
        collection_id=collection_id.reduce((acc,current) => {
          return [...acc,dataCollectionObj[current._id]];
        },[]).join(' , ');

        return [...acc,{collection_id,...rest}];
      },[]);


      const allContainers = Object.values(resultFetch).reduce((acc,current)=>{
        let {warehouse,_id,date_upload,...rest} = current;
        const vps = Object.values(resultVps).filter((value)=>value.container_id===_id);
        //console.log('vps');
        //date_upload = new Date(date_upload).toLocaleDateString('en-US');
        let date_upload_array = date_upload.split('-');
         date_upload = date_upload_array[1]+'/'+ date_upload_array[2] + '/'+date_upload_array[0];
        let date_upload_time = new Date(Number(date_upload_array[0]),Number(date_upload_array[1])-1,Number(date_upload_array[2])).getTime();
        const warehouseFilter = Object.values(resultWareHouse).find((value)=>value._id===warehouse);
        warehouse = warehouseFilter?.name || 'No definido';
        //console.log(warehouseFilter?.name || null);
        return [...acc,{_id,vps,date_upload,date_upload_time,...rest,warehouse,'checked':true,'del':false}];
      },[]);

    return {allContainers,resultWareHouse,resultCalenar};
  }

export function Index() {
  const {Auth,handlerAuth} = useContext(AuthContext);
  const {Message,handlerMessage} =  useContext(MessageContext);
  const dataInfo = useLoaderData();
  const [loading,setLoading] = useState(false);
  const [dataRow,setDataRow] = useState(dataInfo.allContainers);
  const [deleteAll,setDeleteAll] = useState({});
  const [deleting,setDeleting] = useState(false);
  const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
  const [q, setQ] = useState("");
  const [dataRowFilter,setDatarowFilter] = useState([]);
  const [conditionsFilter,setConditionsFilter] = useState({});


  //use ref
  const selectInputRef = useRef([]);

  const handlerClearFilter = ()=>{
    selectInputRef.current['warehouse'].value="";
    selectInputRef.current['typeunload'].value="";
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
        if(conditionsFilter.hasOwnProperty('from') && conditionsFilter.hasOwnProperty('to') && (conditionsFilter['from'] > data['date_upload_time'] || conditionsFilter['to'] < data['date_upload_time']) ){
          return false
        }
        if(conditionsFilter.hasOwnProperty('from') && !conditionsFilter.hasOwnProperty('to') && conditionsFilter['from'] !== data['date_upload_time']){
          return false
        }
        if(query && !data.name.toLocaleLowerCase().includes(query)){
          return false;
        }

        return data;
      }else if(data.name.toLocaleLowerCase().includes(query)){
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
    const result = await ActionFetch(deleteAll,'/api/container/trashall');
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
      const dataRowShow = q.length > 0 || Object.keys(conditionsFilter).length > 0  ? dataRowFilter : dataRow;
       let dataRowCopy = [...dataRowShow];
      let result = dataRowCopy.reduce((key,index,array)=>{
        return {...key,[index._id]:'_id'}
      },{});
      setDeleteAll(result);
    }else{
      setDeleteAll({});
    }
  }
  const handlerExportExcel = ()=>{
    const headerFields = ["TYPE UNLOAD", "BUILDING","CONTAINER","VPS#","COLLECTIONS","PCS","DATE UNLOADING","PPL/PRE-PLANING","PRE-PLANING TIME HRS","PPL/UNLOADED & SORTED","UNLOAD & SORTED TIME HRS","PPL/COUNTED","COUNTED TIME HRS","PPL/QC/PULL, COUNT AND REC","QC/PULL, COUNT AND REC TIME HRS","PPL/STAGING PALLETS","STAGING PALLETS TIME HRS","PPL/VERIFY & EMAIL","VERIFY & EMAIL TIME HRS"];
    const dataRowShow = q.length > 0 || Object.keys(conditionsFilter).length > 0  ? dataRowFilter : dataRow;
 

    
     /* flatten objects */
     let rows = dataRowShow.reduce((acc,row,index)=>{
        let dataSave = {};
        if(row.vps.length === 0){
          dataSave = {
            typeunload:row.typeunload,
            warehouse:row.warehouse,
            container:row.name,
            vps:'n/a',
            collection:'n/a',
            pcs:0,
            date_upload:row.date_upload,
            ppl_preplaning:row.ppl_preplaning,
            preplaning_time: `${row.preplaning_hour}:${row.preplaning_min}`,
            ppl_unloaded:row.ppl_unloaded,
            unltime:`${row.unltime_hour}:${row.unltime_min}`,
            ppl_counted:row.ppl_counted,
            counted_QC:`${row.counted_hours_hour}:${row.counted_hours_min}`,
            ppl_qcpull:row.ppl_qcpull,
            qcpull:`${row.qcpull_hour}:${row.qcpull_min}`,
            ppl_forklift:row.ppl_forklift,
            staging_pallets_time:`${row.staging_pallets_hour}:${row.staging_pallets_min}`,
            ppl_verify_email:row.ppl_verify_email,
            verify_email_time:`${row.verify_email_hour}:${row.verify_email_min}`,
          }
        }

         dataSave = row.vps.map((dataVps,i)=>{

          if(i!==0){
              return {
                typeunload:'',
                warehouse:'',
                container:'',
                vps:dataVps.name,
                collection:dataVps.collection_id,
                pcs:dataVps.pcs,
                date_upload:'',
                ppl_preplaning:'',
                preplaning_time: ``,
                ppl_unloaded:'',
                unltime:``,
                ppl_counted:'',
                counted_QC:` `,
                ppl_qcpull:'',
                qcpull:` `,
                ppl_forklift:'',
                staging_pallets_time:``,
                ppl_verify_email:'',
                verify_email_time:``,
              }

          }
          return {
            typeunload:row.typeunload,
            warehouse:row.warehouse,
            container:row.name,
            vps:dataVps.name,
            collection:dataVps.collection_id,
            pcs:dataVps.pcs,
            date_upload:row.date_upload,
            ppl_preplaning:row.ppl_preplaning,
            preplaning_time: `${row.preplaning_hour}:${row.preplaning_min}`,
            ppl_unloaded:row.ppl_unloaded,
            unltime:`${row.unltime_hour}:${row.unltime_min}`,
            ppl_counted:row.ppl_counted,
            counted_QC:`${row.counted_hours_hour}:${row.counted_hours_min}`,
            ppl_qcpull:row.ppl_qcpull,
            qcpull:`${row.qcpull_hour}:${row.qcpull_min}`,
            ppl_forklift:row.ppl_forklift,
            staging_pallets_time:`${row.staging_pallets_hour}:${row.staging_pallets_min}`,
            ppl_verify_email:row.ppl_verify_email,
            verify_email_time:`${row.verify_email_hour}:${row.verify_email_min}`,
          }
        });
        return [...acc,...dataSave];
      },[])
      let currentRowNumber = Object.keys(conditionsFilter).length > 0 ? 4 : 0;
      let mergeArray = dataRowShow.reduce((acc,row,index)=>{
        currentRowNumber++;
        let dataMerge = [];
        if(row.vps.length > 1){
          const startRow = currentRowNumber;
          const endRow = currentRowNumber + row.vps.length -1;

          for (let index = 0; index < headerFields.length; index++) {
            if(index !== 3 && index !== 4 &&  index !== 5 ) {
              dataMerge.push({ 
                s: { r: startRow, c: index },
                e: { r: endRow, c: index } 
              });
            }
          }

          
          currentRowNumber = endRow;
          return [...acc,...dataMerge];
        }
        return [...acc];
      },[]);
      

      const Options = Object.keys(conditionsFilter).length > 0 ?{ origin: "A5" } : {} ; 
      const worksheet = XLSX.utils.json_to_sheet(rows,{...Options});
    //check if filter apply
    if(Object.keys(conditionsFilter).length > 0){
      const headers = {from:"FROM",to:"TO",warehouse:"BUILDING",typeunload:"TYPE UNLOAD"};
      const headerArray = Object.keys(conditionsFilter).map((key)=>headers[key]);
      const rowFiltersArray = Object.values(conditionsFilter).map((value)=>{
        if(typeof value === 'number'){
          const date = new Date(value);
          return date.toLocaleDateString("en-us",{timeZone: "UTC"});
        }
        return value;
      });
      XLSX.utils.sheet_add_aoa(worksheet, [["FILTER SEARCH SETTING"]], { origin: "A1" });
      XLSX.utils.sheet_add_aoa(worksheet, [headerArray], { origin: "A2" });
      XLSX.utils.sheet_add_aoa(worksheet, [rowFiltersArray], { origin: "A3" });
    }
    //header
    const max_width = dataRowShow.reduce((w, r) => Math.max(w, r.name.length), 14);
    const withFields = new Array(headerFields.length).fill({wch: max_width});
    worksheet["!cols"]=withFields;
    worksheet["!merges"] = mergeArray;
   XLSX.utils.sheet_add_aoa(worksheet, [headerFields], {...Options});
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DETALLE");
    const {countDROP,countLIVE,PCS,VPS} = getCountContainer(dataRowShow);
    const countPPLPreplaning = getPPL(dataRowShow,'ppl_preplaning');
    const countPPLUnl = getPPL(dataRowShow,'ppl_unloaded');
    const countPPLCountedQC = getPPL(dataRowShow,'ppl_counted');
    const countPPLQCpull = getPPL(dataRowShow,'ppl_qcpull');
    const countPPLForklift = getPPL(dataRowShow,'ppl_forklift');
    const countPPLVerify_email = getPPL(dataRowShow,'ppl_verify_email');
    const {countH:countPreplaningH,countM:countPreplaningM} = getTimeCount(dataRowShow,'preplaning_hour','preplaning_min');
    const {countH:countUnltimeH,countM:countUnltimeM} = getTimeCount(dataRowShow,'unltime_hour','unltime_min');
    const {countH:countCounted_QCH,countM:countCounted_QCM} = getTimeCount(dataRowShow,'counted_hours_hour','counted_hours_min');
    const {countH:countQCpullH,countM:countQCpullM} = getTimeCount(dataRowShow,'qcpull_hour','qcpull_min');
    const {countH:countStaging_palletsH,countM:countStaging_palletsM} = getTimeCount(dataRowShow,'staging_pallets_hour','staging_pallets_min');
    const {countH:countVerify_emailH,countM:countVerify_emailM} = getTimeCount(dataRowShow,'verify_email_hour','verify_email_min');


    const resumen = [
      {title:'TOTAL HOUR(s)',time:'',title2:'TOTAL',time2:'',title3:'AVERAGE',time3:''},
      {title:'',time:	'',title2:'CONTAINER',time2:dataRowShow.length,title3:'',time3:''},
      {title:'PRE-PLANING TIME HRS',time:FixTime(countPreplaningH,countPreplaningM),title2:'PPL/PRE-PLANING',time2:countPPLPreplaning,title3:'PPL/PRE-PLANING',time3:PPLAverage(countPPLPreplaning,dataRowShow.length)},
      {title:'UNLOAD & SORTED TIME HRS',time:	FixTime(countUnltimeH,countUnltimeM),title2:'PPL/UNLOAD & SORTED',time2:countPPLUnl,title3:'PPL/UNLOAD & SORTED',time3:PPLAverage(countPPLUnl,dataRowShow.length)},
      {title:'COUNTED TIME HRS',time:	FixTime(countCounted_QCH,countCounted_QCM),title2:'PPL/COUNTED',time2:countPPLCountedQC,title3:'PPL/COUNTED',time3:PPLAverage(countPPLCountedQC,dataRowShow.length)},
      {title:'QC/PULL, COUNT AND REC TIME HRS',time:FixTime(countQCpullH,countQCpullM),title2:'PPL/QC/PULL, COUNT AND REC',time2:countPPLQCpull,title3:'PPL/QC/PULL, COUNT AND REC',time3:PPLAverage(countPPLQCpull,dataRowShow.length)},
      {title:'STAGING PALLETS TIME HRS',time:	FixTime(countStaging_palletsH,countStaging_palletsM),title2:'PPL/STAGING PALLETS',time2:countPPLForklift,title3:'PPL/STAGING PALLETS',time3:PPLAverage(countPPLForklift,dataRowShow.length)},
      {title:'VERIFY & EMAIL TIME HRS',time: FixTime(countVerify_emailH,countVerify_emailM),title2:'PPL/VERIFY & EMAIL',time2:countPPLVerify_email,title3:'PPL/STAGING PALLETS',time3:PPLAverage(countPPLVerify_email,dataRowShow.length)},
      {title:'',time:	'',title2:'DROP',time2:countDROP,title3:'',time3:''},
      {title:'',time:	'',title2:'LIVE UNLOAD',time2:countLIVE	,title3:'',time3:''},
      {title:'',time:	'',title2:'VPS',time2:VPS	,title3:'',time3:''},
      {title:'',time:	'',title2:'PCS',time2:PCS	,title3:'',time3:''},
    ]
    
    Options.skipHeader = true;
    const worksheet2 = XLSX.utils.json_to_sheet(resumen,{...Options});
     //check if filter apply
     if(Object.keys(conditionsFilter).length > 0){
      const headers = {from:"FROM",to:"TO",warehouse:"BUILDING",typeunload:"TYPE UNLOAD"};
      const headerArray = Object.keys(conditionsFilter).map((key)=>headers[key]);
      const rowFiltersArray = Object.values(conditionsFilter).map((value)=>{
        if(typeof value === 'number'){
          const date = new Date(value);
          return date.toLocaleDateString("en-us",{timeZone: "UTC"});
        }
        return value;
      });
      XLSX.utils.sheet_add_aoa(worksheet2, [["FILTER SEARCH SETTING"]], { origin: "A1" });
      XLSX.utils.sheet_add_aoa(worksheet2, [headerArray], { origin: "A2" });
      XLSX.utils.sheet_add_aoa(worksheet2, [rowFiltersArray], { origin: "A3" });
    }
    const withFields2 = [{wch: max_width},{wch: 6},{wch: max_width},{wch: 6},{wch: max_width},{wch: 6}];
    worksheet2["!cols"]=withFields2;
    XLSX.utils.book_append_sheet(workbook, worksheet2, "RESUMEN");
    /* INIT */
    const maxDate = dataRowShow.reduce((acc, current) => {
      let {date_upload} = current;
      return Math.max(acc,new Date(date_upload).getTime());
    }, 0);
    const minDate = dataRowShow.reduce((acc, current) => {
      let {date_upload} = current;
      return Math.min(acc,new Date(date_upload).getTime());
    }, maxDate);
  
    const resultCalenarFilter = dataInfo.resultCalenar.filter((value)=>{
      let {date_register} = value;
      let dateRangeFrom = selectInputRef?.current['from']?.value;
      let dateRangeTo = selectInputRef?.current['to']?.value;
      let date_registerFix = new Date(date_register).getTime();
      
      let dateRangeFromFix = new Date(dateRangeFrom).getTime();
      let dateRangeToFix = new Date(dateRangeTo).getTime();
      if(!dateRangeFrom || !dateRangeTo){
        dateRangeFromFix = minDate;
        dateRangeToFix = maxDate;
  
      }
  
      if(date_registerFix >= dateRangeFromFix && date_registerFix <= dateRangeToFix ){
        return value;
      }
      return false;
    
    });
    const countStart = getTimeCount(resultCalenarFilter,'worker_start_hour','worker_start_min');
    const countFinish = getTimeCount(resultCalenarFilter,'worker_finish_hour','worker_finish_min');
    const countHoursResultObj= CountHours(countStart.countH,countStart.countM,countFinish.countH,countFinish.countM,true);
    const resultToTime = formatNumber(TimeToNumber(countHoursResultObj.countH,countHoursResultObj.countM)); 
    /* END */




    let TotaResumeAverage =  resumeTimeAverage(countPreplaningH,countPreplaningM,countPPLPreplaning,dataRowShow.length,false) + 
      resumeTimeAverage(countUnltimeH,countUnltimeM,countPPLUnl,dataRowShow.length,false) + 
      resumeTimeAverage(countCounted_QCH,countCounted_QCM,countPPLCountedQC,dataRowShow.length,false) + 
      resumeTimeAverage(countQCpullH,countQCpullM,countPPLQCpull,dataRowShow.length,false) + 
      resumeTimeAverage(countStaging_palletsH,countStaging_palletsM,countPPLForklift,dataRowShow.length,false) +
      resumeTimeAverage(countVerify_emailH,countVerify_emailM,countPPLVerify_email,dataRowShow.length,false);
      const fromDate =selectInputRef?.current["from"]?.value? new Date(selectInputRef?.current["from"]?.value).toLocaleDateString("en-us",{timeZone:"utc"}) : new Date(minDate).toLocaleDateString("en-us");
      const toDate =selectInputRef?.current["from"]?.value? new Date(selectInputRef?.current["to"]?.value).toLocaleDateString("en-us",{timeZone:"utc"}) : new Date(maxDate).toLocaleDateString("en-us");

    const resumenTable = [
      {value1:'FROM',value2:fromDate,value3:'TO',value4: toDate},
      {value1:'QTY CONTAINER',value2:'',value3:'',value4: `${dataRowShow.length} QTY`},
      {value1:'',value2:'TIME',value3:'QTY PEOPLE',value4:'TOTAL HOURS (time x QTY people)',title3:'',time3:''},
      {value1:'PRE-PLANNING',value2:FixTime(countPreplaningH,countPreplaningM),value3:PPLAverage(countPPLPreplaning,dataRowShow.length),value4:resumeTimeAverage(countPreplaningH,countPreplaningM,countPPLPreplaning,dataRowShow.length)},
      {value1:'UNLOADED & SORTED',value2:	FixTime(countUnltimeH,countUnltimeM),value3:PPLAverage(countPPLUnl,dataRowShow.length),value4:resumeTimeAverage(countUnltimeH,countUnltimeM,countPPLUnl,dataRowShow.length)},
      {value1:'COUNTED',value2:	FixTime(countCounted_QCH,countCounted_QCM),value3:PPLAverage(countPPLCountedQC,dataRowShow.length),value4:resumeTimeAverage(countCounted_QCH,countCounted_QCM,countPPLCountedQC,dataRowShow.length)},
      {value1:'QC/PULL, COUNT AND REC TIME HRS',value2:FixTime(countQCpullH,countQCpullM),value3:PPLAverage(countPPLQCpull,dataRowShow.length),value4:resumeTimeAverage(countQCpullH,countQCpullM,countPPLQCpull,dataRowShow.length)},
      {value1:'STAGING',value2:	FixTime(countStaging_palletsH,countStaging_palletsM),value3:PPLAverage(countPPLForklift,dataRowShow.length),value4:resumeTimeAverage(countStaging_palletsH,countStaging_palletsM,countPPLForklift,dataRowShow.length)},
      {value1:'VERIFY & EMAIL',value2: FixTime(countVerify_emailH,countVerify_emailM),value3:PPLAverage(countPPLVerify_email,dataRowShow.length),value4:resumeTimeAverage(countVerify_emailH,countVerify_emailM,countPPLVerify_email,dataRowShow.length)},
      {value1:'TOTAL PCS',value2:	PCS,value3:'TOTAL',value4: `${formatNumber(TotaResumeAverage)} / (${resultToTime} WORKERS)`},
    ]
    const worksheet3 = XLSX.utils.json_to_sheet(resumenTable,{...Options});
    //check if filter apply
    if(Object.keys(conditionsFilter).length > 0){
      const headers = {from:"FROM",to:"TO",warehouse:"BUILDING",typeunload:"TYPE UNLOAD"};
      const headerArray = Object.keys(conditionsFilter).map((key)=>headers[key]);
      const rowFiltersArray = Object.values(conditionsFilter).map((value)=>{
        if(typeof value === 'number'){
          const date = new Date(value);
          return date.toLocaleDateString("en-us",{timeZone: "UTC"});
        }
        return value;
      });
      XLSX.utils.sheet_add_aoa(worksheet3, [["FILTER SEARCH SETTING"]], { origin: "A1" });
      XLSX.utils.sheet_add_aoa(worksheet3, [headerArray], { origin: "A2" });
      XLSX.utils.sheet_add_aoa(worksheet3, [rowFiltersArray], { origin: "A3" });
    }
    
    const withFields3 = [{wch: 30},{wch: 8},{wch: 10},{wch: 30}];
    worksheet3["!cols"]=withFields3;
    XLSX.utils.book_append_sheet(workbook, worksheet3, "RESUMEN TABLE");

    XLSX.writeFile(workbook, "Container.xlsx", { compression: true });
    
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
    let result = await ActionFetch({_id},'/api/container/trash');
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
  dataRowShow.sort(function (a, b) {
    if (a.date_upload_time > b.date_upload_time) {
      return 1;
    }
    if (a.date_upload_time < b.date_upload_time) {
      return -1;
    }
    return 0;
  });
  console.log('render');
  /*
    New code 
  */

  const {countDROP,countLIVE,PCS,VPS} = getCountContainer(dataRowShow);
  const countPPLPreplaning = getPPL(dataRowShow,'ppl_preplaning');
  const countPPLUnl = getPPL(dataRowShow,'ppl_unloaded');
  const countPPLCountedQC = getPPL(dataRowShow,'ppl_counted');
  const countPPLQCpull = getPPL(dataRowShow,'ppl_qcpull');
  const countPPLForklift = getPPL(dataRowShow,'ppl_forklift');
  const countPPLVerify_email = getPPL(dataRowShow,'ppl_verify_email');
  const {countH:countPreplaningH,countM:countPreplaningM} = getTimeCount(dataRowShow,'preplaning_hour','preplaning_min');
  const {countH:countUnltimeH,countM:countUnltimeM} = getTimeCount(dataRowShow,'unltime_hour','unltime_min');
  const {countH:countCounted_QCH,countM:countCounted_QCM} = getTimeCount(dataRowShow,'counted_hours_hour','counted_hours_min');
  const {countH:countQCpullH,countM:countQCpullM} = getTimeCount(dataRowShow,'qcpull_hour','qcpull_min');
  const {countH:countStaging_palletsH,countM:countStaging_palletsM} = getTimeCount(dataRowShow,'staging_pallets_hour','staging_pallets_min');
  const {countH:countVerify_emailH,countM:countVerify_emailM} = getTimeCount(dataRowShow,'verify_email_hour','verify_email_min');
  
  const maxDate = dataRowShow.reduce((acc, current) => {
    let {date_upload} = current;
    return Math.max(acc,new Date(date_upload).getTime());
  }, 0);
  const minDate = dataRowShow.reduce((acc, current) => {
    let {date_upload} = current;
    return Math.min(acc,new Date(date_upload).getTime());
  }, maxDate);

  const resultCalenarFilter = dataInfo?.resultCalenar?.filter((value)=>{
    let {date_register} = value;
    let dateRangeFrom = selectInputRef?.current['from']?.value;
    let dateRangeTo = selectInputRef?.current['to']?.value;
    let date_registerFix = new Date(date_register).getTime();
    
    let dateRangeFromFix = new Date(dateRangeFrom).getTime();
    let dateRangeToFix = new Date(dateRangeTo).getTime();
    if(!dateRangeFrom || !dateRangeTo){
      dateRangeFromFix = minDate;
      dateRangeToFix = maxDate;

    }

    if(date_registerFix >= dateRangeFromFix && date_registerFix <= dateRangeToFix ){
      return value;
    }
    return false;
  
  });
  console.log('RESULT FILTER');

  const countStart = getTimeCount(resultCalenarFilter || dataInfo.resultCalenar,'worker_start_hour','worker_start_min');
  const countFinish = getTimeCount(resultCalenarFilter ||dataInfo.resultCalenar,'worker_finish_hour','worker_finish_min');
  const countHoursResultObj= CountHours(countStart.countH,countStart.countM,countFinish.countH,countFinish.countM,true);
  const resultToTime = formatNumber(TimeToNumber(countHoursResultObj.countH,countHoursResultObj.countM)); 

  const TbodyTable = Object.values(dataRowShow).map((data,index)=>{

    if(data.vps.length===0){
      return(
    <tbody key={index} className={data.name}>
        <tr>
          <th scope="row"><input type={'checkbox'} checked={deleteAll.hasOwnProperty(data._id) ? true : false}  value={data._id} onChange={handlerCheck}/></th>
          <td>{data.typeunload}</td>
          <td>{data.warehouse}</td>
          <td>{data.name}</td>
          <td colSpan={3} className={'text-center'}>SIN REGISTROS</td>
          <td>{data.date_upload}</td>
          <td>{data.ppl_preplaning}</td>
          <td>{data.preplaning_hour}:{data.preplaning_min}</td>
          <td>{data.ppl_unloaded}</td>
          <td>{data.unltime_hour}:{data.unltime_min}</td>
          <td>{data.ppl_counted}</td>
          <td>{data.counted_hours_hour}:{data.counted_hours_min}</td>
          <td>{data.ppl_qcpull}</td>
          <td>{data.qcpull_hour}:{data.qcpull_min}</td>
          <td>{data.ppl_forklift}</td>
          <td>{data.staging_pallets_hour}:{data.staging_pallets_min}</td>
          <td>{data.ppl_verify_email}</td>
          <td>{data.verify_email_hour}:{data.verify_email_min}</td>

          <td><Link className={`btn btn-primary ${loading?`disabled`:``}`} onClick={handlerEdit} to={`/container/edit/${data._id}`}><i className='fas fa-pencil'/></Link>
          </td>
        </tr>
        </tbody>
      )
    }
  const vpsRow = data.vps.map((dataVps,i)=>{
    if(i!==0){
      return(
        <tr key={i} >
            <td>{dataVps.name}</td>
            <td>{dataVps.collection_id}</td>
            <td>{dataVps.pcs}</td>
         </tr>   
      )
    }
    return(
      <tr key={i} >
      <th className='align-middle' rowSpan={data.vps.length + 1} scope="row"><input type={'checkbox'} checked={deleteAll.hasOwnProperty(data._id) ? true : false} name={"field"} value={data._id} onChange={handlerCheck}/></th>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.typeunload}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.warehouse}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.name}</td>
      <td>{dataVps.name}</td>
      <td>{dataVps.collection_id}</td>
      <td>{dataVps.pcs}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.date_upload}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.ppl_preplaning}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.preplaning_hour}:{data.preplaning_min}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.ppl_unloaded}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.unltime_hour}:{data.unltime_min}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.ppl_counted}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.counted_hours_hour}:{data.counted_hours_min}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.ppl_qcpull}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.qcpull_hour}:{data.qcpull_min}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.ppl_forklift}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.staging_pallets_hour}:{data.staging_pallets_min}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.ppl_verify_email}</td>
      <td className='align-middle' rowSpan={data.vps.length + 1}>{data.verify_email_hour}:{data.verify_email_min}</td>

      <td className='align-middle' rowSpan={data.vps.length + 1}><Link className={`btn btn-primary ${loading?`disabled`:``}`} onClick={handlerEdit} to={`/container/edit/${data._id}`}><i className='fas fa-pencil'/></Link>
      </td>
    </tr>
    )
    
  }); 

   return(
    <tbody key={index} className={data.name}>
    {vpsRow}
    </tbody>
    )

});
  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {Message.ready && (<AlertMessage sizeClass={"col-12 ms-3 mt-3"} message={Message.message} msgtype={Message.msgtype} typeAlert={"custom"} />) }
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
      
      <div className='row ms-3 mt-3 mb-3 block-radius-style' >
     
      <div className='col-6 mb-3 mt-3 '>
        <input type={'text'} placeholder={'BUSCAR POR CONTAINER'} name={'query'} className={'form-control'} value={q} onChange={(e)=>{handlerSearch(e.currentTarget.value);setQ(e.currentTarget.value)}} />
      </div>
      <div className='col-5 mb-3 mt-3' >
        <button type='button' className='btn btn-primary' onClick={handlerSearchBTN} ><i className='fas fa-search me-2'></i>Buscar</button>
        <button className='btn btn-primary' type='button' data-bs-toggle="modal" data-bs-target="#settingModal" ><i className='fas fa-filter me-2'></i>FILTER</button>
        <button className='btn btn-primary' onClick={handlerExportExcel} ><i className='fas fa-file-export me-2'></i>Exportar</button>
        <button className={`btn btn-primary ${Object.keys(deleteAll).length === 0 || deleting ? 'disabled':''} ` } onClick={handlerDeleteAll} >
        {deleting ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Eliminando..</span></>  : <><i className='fas fa-trash me-2'></i>Eliminar ( {Object.keys(deleteAll).length} )</> }
          </button>
      </div>

      <h2>RESULT OF SEARCHED</h2>
      <Newmodal title={'FILTER SEARCHED'} startModal={true} handlerActionAccept={handlerSearchBTN} handlerActionReset={handlerClearFilter} >
      <div className='row'>
          <div className="col mb-3">
              <label>BUILDING</label>
              <select ref={el => selectInputRef.current['warehouse'] = el}  className="form-select" name='warehouse' required onChange={handlerOnchangeFilter} >
              <option value={""}>ALL</option>
              {dataInfo?.resultWareHouse.map((value)=>(
              <option key={value.name} value={value.name}>{value.name}</option>
              ))} 
                
              </select>
        </div>
        <div className="col-12 mb-3">
        <label>TYPE UNLOAD</label>
          <select className="form-select" ref={el => selectInputRef.current['typeunload'] = el} name='typeunload' required  onChange={handlerOnchangeFilter} >
            <option value={""}>ALL</option>
              <option value={"DROP"}>DROP</option>
              <option value={"LIVE UNLOAD"}>LIVE UNLOAD</option>
            </select>
          </div>
          <div className="col-12 mb-3">
            <label>FROM</label>
          <input type="date" name='from'  ref={el => selectInputRef.current['from'] = el} max={selectInputRef.current['to']?.value || ''} className="form-control" required placeholder="DESDE"  onChange={handlerOnchangeFilter}  />
        </div>
        <div className="col-12 mb-3">
          <label>TO</label>
          <input type="date" name='to' ref={el => selectInputRef.current['to'] = el} min={selectInputRef.current['from']?.value || ''} disabled = {!selectInputRef?.current['from']?.value} className="form-control" required placeholder="HASTA"  onChange={handlerOnchangeFilter}/>
        </div>
      </div>    
      </Newmodal>
  <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
    <li className="nav-item" role="presentation">
      <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">DETALLE</button>
    </li>
    <li className="nav-item" role="presentation">
      <button className="nav-link btn-block" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">RESUMEN</button>
    </li>
    <li className="nav-item" role="presentation">
      <button className="nav-link btn-block" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-newtable" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">RESUMEN TABLE</button>
    </li>
  </ul>
  <div className="tab-content" id="pills-tabContent">
    <div className="tab-pane fade show active " id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
    <div className='row'  >
            <div className="table-responsive mb-5" style={{overflowY:'scroll',height:'410px',overflowX:'scroll',width:'1200px'}} >
            <table className="table table-striped table-hover table-bordered  text-nowrap  text-center "  >
                <thead>
                  <tr>
                    <th scope="col"><input disabled={dataRowShow.length ===0?true:false} type={'checkbox'} checked={Object.keys(deleteAll).length === dataRowShow.length &&  dataRowShow.length > 0 ? true : false} onChange={handlerCheckAll} title={'Seleccionar todos'}/></th>
                    <th scope="col">TYPE UNLOAD</th>
                    <th scope="col">BUILDING</th>
                    <th scope="col">CONTAINER</th>
                    <th scope="col">VPS#</th>
                    <th scope="col">COLLECTIONS</th>
                    <th scope="col">PCS</th>
                    <th scope="col">DATE UNLOADING</th>
                    <th scope="col">PPL/PRE-PLANING</th>
                    <th scope="col">PRE-PLANING TIME HRS</th>
                    <th scope="col">PPL/UNLOADED & SORTED</th>
                    <th scope="col">UNLOAD & SORTED TIME HRS </th>
                    <th scope="col">PPL/COUNTED</th>
                    <th scope="col">COUNTED TIME HRS</th>
                    <th scope="col">PPL/QC/PULL, COUNT AND REC</th>
                    <th scope="col">QC/PULL, COUNT AND REC TIME HRS</th>
                    <th scope="col">PPL/STAGING PALLETS</th>
                    <th scope="col">STAGING PALLETS TIME HRS</th>
                    <th scope="col">PPL/VERIFY & EMAIL</th>
                    <th scope="col">VERIFY & EMAIL TIME HRS</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                {TbodyTable}
                
              </table>
              
              </div>

        </div>

    </div>
    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
      <table className='table table-hover mb-5'>
        <thead>
              <tr>
                <th scope='col' colSpan={2}>TOTAL HOUR(s)</th>
                <th scope='col' colSpan={2}>TOTAL</th>
                <th scope='col' colSpan={2}>AVERAGE</th>

              </tr>
        </thead>
        <tbody>
              <tr>
                <th colSpan={2}>&nbsp;</th>
                <th>CONTAINER</th>
                <td>
                  {dataRowShow?.length || 0}
                </td>
                <th colSpan={2}>&nbsp;</th>

              </tr>
              <tr>
                <th>PRE-PLANING TIME HRS</th>
                <td>
                  {FixTime(countPreplaningH,countPreplaningM)}
                </td>
                <th>PPL/PRE-PLANING</th>
                <td>
                  {countPPLPreplaning || 0 } 
                </td>
                <th>PPL/PRE-PLANING</th>
                <td>
                  {Math.round(Number(countPPLPreplaning) / Number(dataRowShow?.length)) || 0 } 
                </td>
              </tr>
              <tr>
                <th>UNLOAD & SORTED TIME HRS</th>
                <td>
                    {FixTime(countUnltimeH,countUnltimeM)}
                </td>
                <th>PPL/UNLOAD & SORTED</th>
                <td>
                  {countPPLUnl || 0 } 
                </td>
                <th>PPL/UNLOAD & SORTED</th>
                <td>
                    {Math.round(Number(countPPLUnl) / Number(dataRowShow?.length)) || 0 } 
                </td>
              </tr>
              <tr>
                <th>COUNTED TIME HRS</th>
                <td>
                  { String(countCounted_QCH || 0).padStart(2,'0') || 0 }:{ String(countCounted_QCM || 0 ).padStart(2,'0')  || 0 } 
                </td>
                <th>PPL/COUNTED</th>
                <td>
                  { countPPLCountedQC || 0 } 
                </td>
                <th>PPL/COUNTED</th>
                <td>
                {Math.round(Number(countPPLCountedQC) / Number(dataRowShow?.length)) || 0 } 
                </td>
              </tr>
              <tr>
                <th>QC/PULL, COUNT AND REC TIME HRS</th>
                <td>
                {FixTime(countQCpullH,countQCpullM)}
                </td>
                <th>PPL/QC/PULL, COUNT AND REC</th>
                <td>
                  { countPPLQCpull || 0 } 
                </td>
                <th>PPL/QC/PULL, COUNT AND REC</th>
                <td>
                {Math.round(Number(countPPLQCpull) / Number(dataRowShow?.length)) || 0 } 
                </td>
              </tr>
              <tr>
                <th>STAGING PALLETS TIME HRS</th>
                <td>
                {FixTime(countStaging_palletsH,countStaging_palletsM)}
                </td>
                <th>PPL/STAGING PALLETS</th>
                <td>
                  {countPPLForklift || 0 } 
                </td>
                <th>PPL/STAGING PALLETS</th>
                <td>
                   {Math.round(Number(countPPLForklift) / Number(dataRowShow?.length)) || 0 } 
                </td>
              </tr>
              <tr>
              <th>VERIFY & EMAIL TIME HRS</th>
                <td>
                  {FixTime(countVerify_emailH,countVerify_emailM)}
                </td>
                <th>PPL/VERIFY & EMAIL</th>
                <td>
                  {countPPLVerify_email || 0 }
                </td>
                <th>PPL/VERIFY & EMAIL</th>
                <td>
                {Math.round(Number(countPPLVerify_email) / Number(dataRowShow?.length)) || 0 } 
                </td>
              </tr>
              <tr>
              <th colSpan={2}>&nbsp;</th>
                <th>DROP</th>
                <td>{countDROP || 0}</td>
                <th colSpan={2}>&nbsp;</th>
              </tr>
              <tr>
                <th colSpan={2}>&nbsp;</th>
                <th>LIVE UNLOAD</th>
                <td>{countLIVE || 0}</td>
                <th colSpan={2}>&nbsp;</th>
              </tr>
              <tr>
                <th colSpan={2}>&nbsp;</th>
                <th>VPS</th>
                <td>
                  {VPS || 0 }
                </td>
                <th colSpan={2}>&nbsp;</th>
              </tr>
              <tr>
                <th colSpan={2}>&nbsp;</th>
                <th>PCS</th>
                <td>
                  {PCS || 0 }
                </td>
                <th colSpan={2}>&nbsp;</th>
              </tr>
              
              
        </tbody>
      </table>
    </div>
    <div className="tab-pane fade show " id="pills-newtable" role="tabpanel" aria-labelledby="pills-home-tab">
        <table className='table table-bordered text-center'>
          <thead>
            <tr>
              <th>FROM</th>
              <th>{selectInputRef?.current["from"]?.value? new Date(selectInputRef?.current["from"]?.value).toLocaleDateString("en-us",{timeZone:"utc"}) : new Date(minDate).toLocaleDateString("en-us")}</th>
              <th>TO</th>
              <th>{selectInputRef?.current["to"]?.value? new Date(selectInputRef?.current["to"]?.value).toLocaleDateString("en-us",{timeZone:"utc"}) : new Date(maxDate).toLocaleDateString("en-us")}</th>
            </tr>
          <tr>
            <th>QTY CONTAINER</th>
            <th colSpan={2}>&nbsp;</th>
            <th>{dataRowShow?.length || 0}  QTY</th>
          </tr>
          <tr>
            <th>&nbsp;</th>
            <th>
            TIME
            </th>
            <th>QTY PEOPLE (AVERAGE)</th>
            <th>TOTAL HOURS (time x QTY people)</th>
          </tr>
          </thead>
          <tbody>
              <tr>
                <td>PRE-PLANNING</td>
                <td>
                  {String(countPreplaningH || 0).padStart(2,'0')   || 0 }:{String(countPreplaningM || 0).padStart(2,'0') || 0 } 
                </td>
                <td>
                  {Math.round(Number(countPPLPreplaning) / Number(dataRowShow?.length)) || 0 } 
                </td>
                <td>{formatNumber( ((countPreplaningM / 60) + countPreplaningH )* (Math.round(Number(countPPLPreplaning) / Number(dataRowShow?.length) )) || 0 )   }</td>
              </tr>
              <tr>
                <td>UNLOADED & SORTED</td>
                <td>
                  {String(countUnltimeH || 0).padStart(2,'0') || 0 }:{String(countUnltimeM || 0).padStart(2,'0') || 0 } 
                </td>
                <td>
                  {Math.round(Number(countPPLUnl) / Number(dataRowShow?.length)) || 0 } 
                </td>
                <td>{formatNumber(((countUnltimeM / 60) + countUnltimeH) * (Math.round(Number(countPPLUnl) / Number(dataRowShow?.length)) ) || 0 )   }</td>
              </tr>
              <tr>
                <td>COUNTING</td>
                <td>
                { String(countCounted_QCH || 0).padStart(2,'0') || 0 }:{ String(countCounted_QCM || 0 ).padStart(2,'0')  || 0 } 
                </td>
                <td>
                    {Math.round(Number(countPPLCountedQC) / Number(dataRowShow?.length)) || 0 } 
                </td>
                <td>{formatNumber( ((countCounted_QCM / 60) + countCounted_QCH) * (Math.round(Number(countPPLCountedQC) / Number(dataRowShow?.length) )) || 0 )   }</td>
              </tr>
              <tr>
                <td>QC / PULL, COUNT AND REC.</td>
                <td>
                { String(countQCpullH || 0).padStart(2,'0') || 0 }:{ String(countQCpullM || 0 ).padStart(2,'0')  || 0 } 
                </td>
                <td>
                    {Math.round(Number(countPPLQCpull) / Number(dataRowShow?.length)) || 0 } 
                </td>
                <td>{formatNumber( ((countQCpullM / 60) + countQCpullH) * (Math.round(Number(countPPLQCpull) / Number(dataRowShow?.length)) ) || 0 )   }</td>
              </tr>
              <tr>
                <td>STAGING PALLET</td>
                <td>
                {String(countStaging_palletsH || 0).padStart(2,'0') || 0 }:{ String(countStaging_palletsM || 0).padStart(2,'0') || 0 } 
                </td>
                <td>
                  {Math.round(Number(countPPLForklift) / Number(dataRowShow?.length)) || 0 } 
                </td>
                <td>{formatNumber( ((countStaging_palletsM / 60) + countStaging_palletsH) * (Math.round(Number(countPPLForklift) / Number(dataRowShow?.length)) ) || 0 )   }</td>
              </tr>
              <tr>
                <td>VERIFY & EMAIL</td>
                <td>
                    {String(countVerify_emailH || 0).padStart(2,'0') || 0 }:{ String(countVerify_emailM || 0).padStart(2,'0') || 0 } 
                </td>
                <td>
                     {Math.round(Number(countPPLVerify_email) / Number(dataRowShow?.length)) || 0 } 
                </td>
                <td>{formatNumber( ((countVerify_emailM / 60) + countVerify_emailH) * (Math.round(Number(countPPLVerify_email) / Number(dataRowShow?.length)) ) || 0 )   }</td>
              </tr>
          </tbody>
          <tfoot>
            <tr>
              <th>TOTAL PCS</th>
              <th>{PCS || 0 }</th>
              <th>TOTAL</th>
              <th>{
                formatNumber(
                  (
                    (( (countVerify_emailM / 60) + countVerify_emailH) * (Math.round(Number(countPPLVerify_email) / Number(dataRowShow?.length))) || 0)+
                    (( (countStaging_palletsM / 60) + countStaging_palletsH) * (Math.round(Number(countPPLForklift) / Number(dataRowShow?.length))) || 0 )+
                    (( (countCounted_QCM / 60) + countCounted_QCH) * (Math.round(Number(countPPLCountedQC) / Number(dataRowShow?.length))) || 0 )+
                    (( (countUnltimeM / 60) + countUnltimeH) * (Math.round(Number(countPPLUnl) / Number(dataRowShow?.length))) || 0 )+
                    (( (countPreplaningM / 60) + countPreplaningH) * (Math.round(Number(countPPLPreplaning) / Number(dataRowShow?.length))) || 0 ) +
                    (( (countQCpullM / 60) + countQCpullH) * (Math.round(Number(countPPLQCpull) / Number(dataRowShow?.length))) || 0 )
                    )
                )
                }/{`(${resultToTime} WORKERS)`}</th>
            </tr>
          </tfoot>
        </table>
    </div>
  </div>
          </div>
      </div>
    )
  }
