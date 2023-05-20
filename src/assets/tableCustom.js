import React,{useState,useEffect} from 'react'
import {Link, useHref} from 'react-router-dom'

export default function TableCustom({columm=[],rows=[],actions}) {
    const [rowState,setRowState] = useState([]);
    const [colummState,setColummState] = useState([]);
    const [limitRow,setLimitRow] = useState(10);
    const [totalPages,setTotalPages] = useState(0);
    const [startPages,setStartPages] = useState(0);


    
    
    const [currentPage,setCurrentPage] = useState(0);

    const paginateGood = (array, page_size, page_number) => {
        return array.slice(page_number * page_size, page_number * page_size + page_size);
      };

    const loadData = React.useCallback(()=>{
        const columm_all = [...columm].filter((value)=>value?.hide!==true);
        columm_all.push({label:"Action",field:'action'});

        setColummState(columm_all);
        const row_all = [...rows].map((row)=>{
            const data = {};
            for(let value of columm_all){
                if(value.field==='action'){
                    data.action = actions(row.id);
                    continue;
                }
                data[value.field]=row[value.field];
            }
        return data;
        });
        const maxPages = Math.ceil(rows.length / limitRow); 
        setTotalPages(maxPages);
        const result = paginateGood(row_all,limitRow,currentPage);
        console.log("paginate",paginateGood(row_all,limitRow,currentPage));

        setRowState(result);

    },[setColummState,setRowState,columm,rows,actions,limitRow,currentPage])
    useEffect(()=>{
        if(rowState.length>0)return;
        loadData();
    },[loadData,rowState])
    useEffect(()=>{
        loadData();
    },[loadData,currentPage])
    console.log(columm);

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
    const createArray = (rangoMaximo)=> {
        let arrayOrdenado = [];

        for (let i = 0; i <= rangoMaximo; i++) {
            arrayOrdenado.push(i);
        }

        arrayOrdenado.sort(function(a, b) {
            return a - b;
        });

        return arrayOrdenado;
      }
      function mantenerDiezPosiciones(array, nuevoElemento) {
        array.push(nuevoElemento); // Agregar nuevo elemento al final del array
        
        if (array.length > 10) {
          array.shift(); // Eliminar el primer elemento (posición más baja)
        }
        
        return array;
      }
    const  mostrarPagina =  (lista, pagina)=> {
        let elementosPorPagina = 10;
        let indiceInicial = (pagina - 1) * elementosPorPagina;
        let indiceFinal = indiceInicial + elementosPorPagina;
        
        let elementosMostrados = lista.slice(indiceInicial, indiceFinal);
        return elementosMostrados;
      }
    const generateItems = () => {
        const items = [];
        let countPositions = 1;
        console.log({startPages});
        for(let i = startPages; i < totalPages;i++){
            if(countPositions===6)break;
          items.push(<li className={`page-item ${(currentPage)===i ? 'active' : ''}`} active key={i}><Link className="page-link" onClick={(e)=>handlerChangePage(e,i)}>{Number(i)+1}</Link></li>);
          countPositions++;
        }
        if(totalPages>5){
              items.push(<li className={`page-item disabled`} active key={totalPages+1}><Link className="page-link">..</Link></li>);
              items.push(<li className={`page-item disabled`} active key={totalPages+2}><Link className="page-link">{totalPages}</Link></li>);
              
            }
        return items;
      };

  return (

    <div className='table-responsive'>
        <table className='table table-hover table-bordered mt-5 mb-5' tabIndex={1}>
            <thead>
                <tr>
                    {colummState.map(key=><td key={key.field}>{key.label}</td>)}
                </tr>
            </thead>
            <tbody>
                {rowState.map((row,index)=>(<tr key={row?.id}>{colummState.map((key,index)=><td key={(row.id+index)}>{row[key.field]}</td>)}</tr>))}
            </tbody>
        </table>
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 0? 'disabled':'' }`}><Link className="page-link" tabindex="-1" onClick={(e)=>handlerChangePage(e,0)} aria-disabled="true">Primera</Link></li>
                <li className={`page-item ${currentPage === 0? 'disabled':'' }`}><Link className="page-link" tabindex="-1" onClick={(e)=>handlerChangePage(e,currentPage-1)} aria-disabled="true">Anterior</Link></li>
                              {generateItems()}
                <li className={`page-item ${(totalPages-1)===currentPage? 'disabled':'' }`}><Link className="page-link"  onClick={(e)=>handlerChangePage(e,currentPage+1)}>Siguiente</Link></li>
                <li className={`page-item ${(totalPages-1)===currentPage? 'disabled':'' }`}><Link className="page-link"  onClick={(e)=>handlerChangePage(e,totalPages-1)} >Ultimo</Link></li>

            </ul>
         </nav>
    </div>
  )
}
