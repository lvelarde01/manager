import React,{useState,useEffect} from 'react';
import {Link, useHref} from 'react-router-dom';
import InputCustom from '../assets/inputCustom';
import { cloneDeep, cloneDeepWith, set } from 'lodash';

export function CheckBoxCustom({setCheckAll,checkAll,onChange,idsCheckbox=[],setIdsCheckbox,value,currentPage}){
    const [check,setCheck] = useState(false);
    useEffect(()=>{
        if(value ==="all"){
            const checkAllValue = checkAll?.hasOwnProperty(currentPage) ? checkAll[currentPage] :[];
            const checkClick = checkAllValue?.includes(value) || false;
            setCheck(checkClick); 
            return;
        };
        const checkClick = idsCheckbox[currentPage]?.includes(value) || false;
        setCheck(checkClick) 
    },[idsCheckbox,currentPage,value,checkAll]);

   const handlerOnChange = (event)=>{
        const checkClick = event.currentTarget.checked;

        if(typeof setCheckAll === "function" && value !=="all"){
            setCheckAll((pre)=>{
                let {[currentPage]:currentRow=[],...all} = pre || {};
                    if(!checkClick){
                        return  {...all,[currentPage]:''}
                    }
                    return pre;
            });
        }

        if(typeof setIdsCheckbox === "function"){
            setIdsCheckbox((pre)=>{
                let {[currentPage]:currentRow=[],...all} = pre;
                if(checkClick && !currentRow?.includes(value)){
                    currentRow.push(value);
                }else if(!checkClick){
                    currentRow = currentRow?.filter((query)=>query !==value); 
                }
                return {...all,[currentPage]:currentRow}; 
            });
        }

        if(typeof onChange === "function"){
            onChange(event);
            setCheckAll((pre)=>{
                let {[currentPage]:currentRow=[],...all} = pre || {};
                    if(!checkClick){
                        return  {...all}
                    }
                return {...all,[currentPage]:"all"}; 
            });
        }

        setCheck(checkClick);
    console.warn({idsCheckbox});
   }

    return (
        <><input type={'checkbox'} checked={check} onChange={handlerOnChange} value={value} /></>
    );
}

export default function TableCustom({columm=[],rows=[],actions}) {
    const [rowState,setRowState] = useState([]);
    const [colummState,setColummState] = useState([]);
    const [limitRow,setLimitRow] = useState(10);
    const [totalPages,setTotalPages] = useState(0);
    const [startPages,setStartPages] = useState(0);
    const [currentPage,setCurrentPage] = useState(0);
    const [checkAll,setCheckAll] = useState({});
    const [idsCheckbox,setIdsCheckbox] = useState({});

    const handlerCheckAll = (event,result)=>{
        const checkClick = event.currentTarget.checked; 
        console.log("checkAll");
         result = result.map((value)=>value.id); 
        if(checkClick){
            setIdsCheckbox((pre)=>{
                let {[currentPage]:currentRow=[],...all} = pre;
                return {...all,[currentPage]:result};
            });
        }else{
            setIdsCheckbox((pre)=>{
                let {[currentPage]:currentRow=[],...all} = pre;
                return {...all}
            });
        }

    }

    const paginateGood = React.useCallback((array, page_size, page_number) => {
        return array.slice(page_number * page_size, page_number * page_size + page_size);
      },[]);
        const columm_all = [...columm].filter((value)=>value?.hide!==true);
        columm_all.push({label:"Action",field:'action'});
        columm_all.unshift({label:<CheckBoxCustom setCheckAll={setCheckAll} checkAll={checkAll} onChange={event=>handlerCheckAll(event,result)} currentPage={currentPage} value={"all"} />,field:'check'});
        const row_all = [...rows].map((row)=>{
            const data = {};
            for(let value of columm_all){
                if(value.field==='check'){
                    data.check = <CheckBoxCustom setCheckAll={setCheckAll} value={row.id} setIdsCheckbox={setIdsCheckbox} idsCheckbox={idsCheckbox} currentPage={currentPage} />;
                    continue;
                }
                if(value.field==='action'){
                    data.action = actions(row.id);
                    continue;
                }
                data[value.field]=row[value.field];
            }
        return data;
        });
        const maxPages = Math.ceil(rows.length / limitRow);
        const result = paginateGood(row_all,limitRow,currentPage);
       // setColummState(columm_all);
       // setTotalPages(maxPages);
       // setRowState(result);

    const handlerChangePage = (event,numberPage)=>{
        event.preventDefault();
        if(numberPage < 0 )return;
        let diferential = currentPage - 3;
        console.log({diferential});
        if(diferential >= 0){
            setStartPages(diferential);
        }
        setCurrentPage(numberPage);

    }
    const generateItems = () => {
        const items = [];
        let countPositions = 1;
        for(let i = startPages; i < maxPages;i++){
            if(countPositions===6)break;
          items.push(<li className={`page-item ${(currentPage)===i ? 'active' : ''}`}  key={i}><Link className="page-link" onClick={(e)=>handlerChangePage(e,i)}>{Number(i)+1}</Link></li>);
          countPositions++;
        }
        if(maxPages>5){
              items.push(<li className={`page-item disabled`}  key={maxPages+1}><Link className="page-link">..</Link></li>);
              items.push(<li className={`page-item disabled`}  key={maxPages+2}><Link className="page-link">{maxPages}</Link></li>);
              
            }
        return items;
      };

  return (
    <>
    <div className='row'>
        <InputCustom classNameField='form-control form-control-lg' labelFieldEnable={false} placeholderField='Buscar por..' nameField='fn' typeField='text'  />
        <div className='col-6'>
            <button className='btn btn-primary'><i className='fa fa-search me-2'></i>Buscar</button>
            <button className='btn btn-primary'><i className='fa fa-filter me-2'></i>filter</button>
            <button className='btn btn-primary'><i className='fa fa-trash me-2'></i>Borrar ({Object.values(idsCheckbox).flat().length})</button>
            <button className='btn btn-primary'><i className='fa fa-book me-2'></i>Exportar</button>
            <button className='btn btn-primary'><i className='fa fa-gear me-2'></i>Ajuste</button>
        
        </div>
        <div className='col-12'>
            <div className='table-responsive' style={{height:'60vh'}}>
                <table className='table table-hover table-bordered ' tabIndex={1}>
                    <thead className='sticky-top table-primary'>
                        <tr>
                            {columm_all.map(key=><td key={key.field}>{key.label}</td>)}
                        </tr>
                    </thead>
                    <tbody>
                        {result.map((row,index)=>(<tr key={row?.id}>{columm_all.map((key,index)=><td key={(row.id+index)}>{row[key.field]}</td>)}</tr>))}
                    </tbody>
                </table>
            
            </div>
            </div>
                <nav className='col-12' style={{height:'25vh'}}>
                    <ul className="pagination justify-content-center mt-3">
                        <li className={`page-item ${currentPage === 0? 'disabled':'' }`}><Link className="page-link" tabIndex="-1" onClick={(e)=>handlerChangePage(e,0)} aria-disabled="true">Primera</Link></li>
                        <li className={`page-item ${currentPage === 0? 'disabled':'' }`}><Link className="page-link" tabIndex="-1" onClick={(e)=>handlerChangePage(e,currentPage-1)} aria-disabled="true">Anterior</Link></li>
                                    {generateItems()}
                        <li className={`page-item ${(maxPages-1)===currentPage? 'disabled':'' }`}><Link className="page-link"  onClick={(e)=>handlerChangePage(e,currentPage+1)}>Siguiente</Link></li>
                        <li className={`page-item ${(maxPages-1)===currentPage? 'disabled':'' }`}><Link className="page-link"  onClick={(e)=>handlerChangePage(e,maxPages-1)} >Ultimo</Link></li>

                    </ul>
                </nav>
        </div>
        </>
  )
}
