import React,{useContext,useState} from 'react'
import {useLoaderData,useNavigate, Form,redirect} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {startUp} from '../../requests/users';
import { ActionFetch } from '../../requests/container';
import {schema_register} from '../../requests/rules';
import AlertMessage from '../../assets/alertmessage';


export async function loader( {params} ) {
    let result = await ActionFetch({_id:params.id},'/api/collection/getinfo');
    console.log(result)
    return result;
    }



export function Edit() {
    const {Auth} = useContext(AuthContext);
    const [loading,setLoading] = useState(false);
    const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
    const [errors,setErrors] = useState({});

    const dataInfo = useLoaderData();
    const navigate = useNavigate();

    const handlerOnchange = (event)=>{
    const nameField = event.target.name; 
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
    
    const {error,dataUserObj} = await startUp({data,schema:schema_register});
    if(Object.entries(error).length > 0){
        setTimeout(()=>{
            setFetchReady({ready:true,msgtype:'danger',message:''});
            setErrors({...error});
            setLoading(false);
        },3000);
        return;
    }
    console.log("NO ERRORS");
    const result = await ActionFetch({...dataUserObj,_id:dataInfo._id},'/api/collection/edit');
    if(result.acknowledged){
        setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'success',message:'Se guardo correctamente.'});
        setLoading(false);
        },3000);
    }else{
        setTimeout(()=>{
        setFetchReady({ready:true,msgtype:'danger',message:'Se presento un problema, Por favor, verifique e intente de nuevo.'});
        setLoading(false);
        setErrors({...result});
        },3000);
    }
    }





    return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
        <Form className='col-12 mt-3' method='post' onSubmit={handlerOnSubmit} >
        <fieldset>
        <div className="mb-3">
        <h2>MODIFICAR DE CONTAINER</h2>
        </div>
        <legend>Informacion</legend>
        <div className="mb-3">
            <input type="text" name='name' defaultValue={dataInfo.name} className="form-control" required placeholder="Nombre de WareHouse" onChange={handlerOnchange}/>
            {errors?.name && <p className='text-center text-danger mx-1 mt-1' >*{errors.name}*</p>}
        </div>
        <div className="mb-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></>  : <><i className='fas fa-floppy-disk me-2'></i>Guardar</> }
            </button>
            <button type="button" className="btn btn-primary float-end" disabled={loading} onClick={()=>{navigate('/collection/')}} ><i className='fas fa-arrow-rotate-left me-2'></i>Cancelar</button>

        </div>
        </fieldset>
    </Form>
    </div>
    </div>
    )
}

