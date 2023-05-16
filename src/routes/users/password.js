import React,{useState,useContext} from 'react'
import {useLoaderData,useNavigate, Form} from "react-router-dom";
import AuthContext from '../../context/auth-context';
import {startUp,schema_password} from '../../requests/users';
import {ActionFetch} from '../../requests/utilsApis'
import InputCustom from '../../assets/inputCustom';
import AlertMessage from '../../assets/alertmessage';

export async function loader({request}){

 
}

export function Password() {
    const {Auth,handlerAuth} = useContext(AuthContext);
    const [loading,setLoading] = useState(false);
    const [fetchReady,setFetchReady] = useState({ready:false,msgtype:'success',message:'default'});
    const [errors,setErrors] = useState({});
    const [showPassword,setShowPassword] = useState(false);
    const [defaultValues,setDefaultValues] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (event) =>{
        event.preventDefault();
        setLoading(true);
        setFetchReady({ready:false,msgtype:'success',message:'default'});
        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);
        const {error,dataUserObj} = await startUp({data,schema:schema_password,ignoreRules:{oldpassword:{rules:[{'onlyNumberAndLetterSimbols':true},{'minLength':true}]}}});
        dataUserObj._id=Auth.id;
        dataUserObj.createPassword=Auth?.type_login ==="normal"? false : true;
        if(Object.entries(error).length > 0){
            setTimeout(()=>{
              setFetchReady({ready:true,msgtype:'danger',message: typeof error === "string" ? error : ''});
              setErrors({...error});
              setLoading(false);
            },3000);
            return;
        }
        const result = await ActionFetch({dataObj:dataUserObj,UrlFetch:'/api/users/password'});
        if(result.acknowledged){
          setTimeout(()=>{
            setFetchReady({ready:true,msgtype:'success',message:''});
            handlerClearValues();
            setLoading(false);
          },3000);
        }else{
          setTimeout(()=>{
            setFetchReady({ready:true,msgtype:'danger',message:result?.error || ''});
            setErrors({...result?.errors});
            setLoading(false);
          },3000);

        }
      }
    const handlerShowPassword = ()=>{
        setShowPassword(!showPassword);
    }
    const handlerClearValues = ()=>{
      setDefaultValues({});
    }
    const handlerOnchangeDefaulValue = (event)=>{
      const value = event.currentTarget.value;
      const name = event.currentTarget.name;
      const {[name]:nameField_cp,...defaultValues_cp} = {...defaultValues};
      defaultValues_cp[name]=value;
      setDefaultValues(defaultValues_cp);
  }
  return (
    <>
    <div className={`row justify-content-center ${Auth.theme}-style`} >
        {fetchReady.ready && (<AlertMessage message={fetchReady.message} msgtype={fetchReady.msgtype} typeAlert={"custom"} />) }
        <div className='row ms-3 mt-3 block-radius-style'>
            <Form className='col-12 mt-3' method='post' onSubmit={handleSubmit}  >
              <fieldset>
              <div className="mb-3">
                <h2>CAMBIO DE CONTRASEÑA</h2>
              </div>
              <div className='row'>
                          <legend>SEGURIDAD</legend>
                        {Auth?.type_login === "normal" ? <InputCustom  placeholderField={'Contraseña Actual'} typeField={showPassword? "text": "password"} nameField={'oldpassword'} onChange={handlerOnchangeDefaulValue} valueField={defaultValues?.oldpassword} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />:""}
                          <InputCustom  placeholderField={'Contraseña Nueva'} typeField={showPassword? "text": "password"} nameField={'password'} onChange={handlerOnchangeDefaulValue} valueField={defaultValues?.password} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          <InputCustom  placeholderField={'Contraseña nueva Confirmar'} typeField={showPassword? "text": "password"} nameField={'repeatpassword'} onChange={handlerOnchangeDefaulValue} valueField={defaultValues?.repeatpassword} parentClassname={'col-12 mb-3'} errorsField={errors} setErrorField = {setErrors} />
                          </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? <><span className="spinner-grow spinner-grow-sm me-2"></span><span>Actualizando</span></>  : <><i className="fas fa-floppy-disk me-2"></i>Guardar</> }
                  </button>
                  
                  <button type="button" disabled={loading} onClick={handlerShowPassword} className="btn btn-primary"><>{showPassword?<i className='fas fa-eye-slash me-2'></i>:<i className='fas fa-eye me-2'></i>}</>Mostrar Contraseña</button>
                  
                  <button type="button" disabled={loading} onClick={()=>{navigate('/')}} className="btn btn-primary float-end"><i className='fas fa-arrow-rotate-left me-2'></i>Regresar</button>
                </div>
              </fieldset>
            </Form>
    </div>
    </div>
    </>
  )
}
