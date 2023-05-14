export const defaultVarsInit = {token:'',theme:'green',photo:'',saveConfigBrowser:false};
export const schema_warehouse = {
  name:{
    rules:[
            {
              name:'onlyNumberAndLetterSimbolsSpaces',
              message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
            },
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 3 y maximo 10.',
              minLength:3,
              maxLength:20,
            },
            {
              name:'isUnique',
              message:'WareHouse ya Registrado.',
              urlQuery:'/api/warehouse/checkisunique'

            },
          ]
  },
}
export const schema_vps= {
  name:{
    rules:[
            {
              name:'minLength',
              minLength:5,
              message:'Debe ingresar minimo de 5 digitos.',
            },
            {
              name:'isUnique',
              message:'VPS ya Registrado.',
              urlQuery:'/api/vps/checkisunique'

            },
          ]
  },
  pcs:{
    rules:[
            {
              name:'onlyNumber',
              message:'Solo numeros permitidos.',
            },
          ]
  },
  container_id:{
    rules:[
            {
              name:'onlyNumberAndLetter',
              message:'Seleccione un Container.',
            },
          ]
  },
  collection_id:{
    rules:[
      {
        name:'minLength',
        message:'Seleccione una coleccion',
        minLength:1,
      }
    ]
  }
}
export const schema_workers = {
  name:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 50.',
              minLength:5,
              maxLength:50,
            },
            {
              name:'isUnique',
              message:'Worker Register.',
              urlQuery:'/api/workers/checkisunique'
            },
          ]
  },
}
export const schema_department = {
  name:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 2 y maximo 50.',
              minLength:2,
              maxLength:50,
            },
            {
              name:'isUnique',
              message:'Departamento Register.',
              urlQuery:'/api/departments/checkisunique'
            },
          ]
  },
}
export const schema_calendars = {
  worker_id:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 2 y maximo 50.',
              minLength:2,
              maxLength:50,
            },
          ],
  },
  department_id:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 2 y maximo 50.',
              minLength:2,
              maxLength:50,
            },
          ],
  },
  date_register:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 2 y maximo 50.',
              minLength:1,
              maxLength:50,
            },
          ],
  },
  worker_start_hour:{
    rules:[
            {
              name:'onlyNumber',
              message:'Por favor, seleccione un valor.',
            },
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 2 y maximo 50.',
              minLength:1,
              maxLength:50,
            },
          ],
  },
  worker_start_min:{
    rules:[
            {
              name:'onlyNumber',
              message:'Por favor, seleccione un valor.',
            },
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 2 y maximo 50.',
              minLength:1,
              maxLength:50,
            },
          ],
  },
  worker_finish_hour:{
    rules:[
            {
              name:'onlyNumber',
              message:'Por favor, seleccione un valor.',
            },
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 2 y maximo 50.',
              minLength:1,
              maxLength:50,
            },
          ],
  },
  worker_finish_min:{
    rules:[
            {
              name:'onlyNumber',
              message:'Por favor, seleccione un valor.',
            },
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 2 y maximo 50.',
              minLength:1,
              maxLength:50,
            },
          ],
  },
}
export const schema_collection = {
  name:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 2 y maximo 50.',
              minLength:2,
              maxLength:50,
            } ,
            {
              name:'isUnique',
              message:'Collection registrada',
              urlQuery: '/api/collection/checkisunique'
            },
          ]
  },
  rugid:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 2 y maximo 50.',
              minLength:2,
              maxLength:50,
            }
          ]
  },
}
export const schema_container = {
  name:{
    defaultValue:'algo',
    clearOnregister:true,
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:5,
              maxLength:20,
            },
            {
              name:'isUnique',
              message:'Container ya registrado',
              urlQuery:'/api/container/checkisunique',
              onUpdate:false
            }
          ]
  },
  date_upload:{
    defaultValue:'',
    clearOnregister:true,
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
            },
          ]
  },
  warehouse:{
    defaultValue:'',
    clearOnregister:true,
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:200,
            },
          ]
  },
  typeunload:{
    defaultValue:"DROP",
    clearOnregister:true,
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
            },
          ]
  },
  ppl_preplaning:{
    defaultValue:1,
    clearOnregister:true,
    rules:[
      {
        name:'onlyNumber',
        message:'Por favor, seleccione un valor.',
      }
    ]
  },
  preplaning_hour:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumberAndLetter',
              message:'Seleccione un Valor.',
            },
          ]
  },
  preplaning_min:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumberAndLetter',
              message:'Seleccione un Valor.',
            },
          ]
  },
  ppl_unloaded:{
    defaultValue:1,
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumber',
              message:'Minimo de caracteres 5 y maximo 10.',
            },
          ]
  },
  unltime_hour:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumberAndLetter',
              message:'Seleccione un Valor.',
            },
          ]
  },
  unltime_min:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumberAndLetter',
              message:'Seleccione un Valor.',
            },
          ]
  },
  counted_hours_hour:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
      {
        name:'onlyNumberAndLetter',
        message:'Seleccione un Valor.',
      },
          ]
  },
  counted_hours_min:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumberAndLetter',
              message:'Seleccione un Valor.',
            },
          ]
  },
  ppl_counted:{
    defaultValue:1,
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumber',
              message:'Por favor, seleccione un valor.',
            },
          ]
  },
  qcpull_hour:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
      {
        name:'onlyNumberAndLetter',
        message:'Seleccione un Valor.',
      },
          ]
  },
  qcpull_min:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumberAndLetter',
              message:'Seleccione un Valor.',
            },
          ]
  },
  ppl_qcpull:{
    defaultValue:1,
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumber',
              message:'Por favor, seleccione un valor.',
            },
          ]
  },
  staging_pallets_hour:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumberAndLetter',
              message:'Seleccione un Valor.',
            },
          ]
  },
  staging_pallets_min:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumberAndLetter',
              message:'Seleccione un Valor.',
            },
          ]
  },
  ppl_forklift:{
    defaultValue:1,
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumber',
              message:'Por favor, seleccione un valor.',
            },
          ]
  },
  ppl_verify_email:{
    defaultValue:1,
    clearOnregister:true,
    rules:[
      {
        name:'onlyNumber',
        message:'Por favor, seleccione un valor.',
      },
    ]
  },
  verify_email_hour:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumberAndLetter',
              message:'Seleccione un Valor.',
            },
          ]
  },
  verify_email_min:{
    defaultValue:'01',
    clearOnregister:true,
    rules:[
            {
              name:'onlyNumberAndLetter',
              message:'Seleccione un Valor.',
            },
          ]
  },
}
export const schema_register = {
    name:{
      rules:[
              {
                name:'onlyNumberAndLetterSimbolsSpaces',
                message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
              },
              {
                name:'minMaxLength',
                message:'Minimo de caracteres 5 y maximo 10.',
                minLength:5,
                maxLength:20,
              },
            ]
    },
  }
  export const schema_newuser = {
    username:{
                rules:[
                        {
                          name:'onlyNumberAndLetter',
                          message:'Solo permitido letras y numeros.'
                        },
                        {
                          name:'isUnique',
                          message:'Usuario ya Registrado.'
                        },
                      ]
              },
    password:{
                rules:[
                        {
                          name:'onlyNumberAndLetterSimbols',
                          message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                        },
                        {
                          name:'compareField',
                          matchField:'repeatpassword',
                          message:'No Coincide la contrasena.'
                        },
                        {
                          name:'minMaxLength',
                          message:'Minimo de caracteres 5 y maximo 10.',
                          minLength:5,
                          maxLength:10,
                        },
                      ]
              },
    repeatpassword:{  
                rules:[
                        {
                          name:'onlyNumberAndLetterSimbols',
                          message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                        },
                        {
                          name:'compareField',
                          matchField:'password',
                          message:'No Coincide la contrasena.'
                        },
                        {
                          name:'minMaxLength',
                          message:'Minimo de caracteres 5 y maximo 10.',
                          minLength:5,
                          maxLength:10,
                        },
                      ],
                      ignoreFieldForsave:true,
                  },
    role:{  
            rules:[
                    {
                      name:'onlyLetters',
                      message:'Seleccione el valor correcto.'
                    },
                  ]
          },
    firstname:{  
                rules:[
                        {
                          name:'onlyLettersSpaces',
                          message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                        },
                      ]
              },
    lastname:{  
                rules:[
                        {
                          name:'onlyLettersSpaces',
                          message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                        },
                      ]
              },
    email:{  
                rules:[
                        {
                          name:'email',
                          message:'ingrese un correo electronico valido'
                        },
                        {
                          name:'isUnique',
                          message:'Correo Electronico ya registrado.'
                        },
                      ]
          },
  }
  export const schema_register_edit = {
    username:{
                rules:[
                        {
                          name:'onlyNumberAndLetter',
                          message:'Solo permitido letras y numeros.'
                        },
                      ]
              },
    role:{  
            rules:[
                    {
                      name:'onlyLetters',
                      message:'Seleccione el valor correcto.'
                    },
                  ]
          },
    firstname:{  
                rules:[
                        {
                          name:'onlyLettersSpaces',
                          message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                        },
                      ]
              },
    lastname:{  
                rules:[
                        {
                          name:'onlyLettersSpaces',
                          message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                        },
                      ]
              },
    email:{  
                rules:[
                        {
                          name:'email',
                          message:'ingrese un correo electronico valido'
                        },
                      ]
          },
  }