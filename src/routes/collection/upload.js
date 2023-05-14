import React,{useContext,useState} from 'react'
import {useLoaderData,useNavigate, Form,redirect} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {startUp} from '../../requests/users';
import {ActionFetch} from '../../requests/container';
import {schema_collection} from '../../requests/rules'
import AlertMessage from '../../assets/alertmessage';
import * as XLSX from 'xlsx';

export async function loader({ request }) {

    return {};
  }

export function Upload() {
    const {Auth} = useContext(AuthContext);
    const [loading,setLoading] = useState(false);
    const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
    const [errors,setErrors] = useState({});
    const [dataTable,setDataTable] = useState({});
  
    const dataInfo = useLoaderData();
    const navigate = useNavigate();
    const handlerOnchange = ()=>{

    }
    const handlerOnSubmit = ()=>{

    }
    const handlerUpload = ()=>{

    }
    const handlerUploadMatch = ()=>{

    }
  return (
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
        <Form className='col-12 mt-3' method='post' onSubmit={handlerOnSubmit} >
      <fieldset>
      <div className="mb-3">
        <h2>UPLOAD COLLECTIONS</h2>
      </div>
        <legend>INFORMATIONS</legend>

        <div className="mb-3">
          <input type="file" name='name' className="form-control" required placeholder="NAME COLLECTION" onChange={handlerUpload}/>
          {errors?.name && <p className='text-center text-danger mx-1 mt-1' >*{errors.name}*</p>}
        </div>
        {dataTable?.stocks?.length&&<div className="mb-3">
          <input type="file" name='name_compare' className="form-control" required placeholder="NAME COLLECTION" onChange={handlerUploadMatch}/>
          {errors?.name && <p className='text-center text-danger mx-1 mt-1' >*{errors.name}*</p>}
        </div>}
        <div className="mb-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Guardando..</span></>  : <><i className='fas fa-floppy-disk me-2'></i>SAVE</> }
            </button>
          <button type="button" className="btn btn-primary float-end" disabled={loading} onClick={()=>{navigate('/collection/')}} ><i className='fas fa-arrow-rotate-left me-2'></i>BACK</button>

        </div>
      </fieldset>
    </Form>
    </div>
    </div>
  )
}
