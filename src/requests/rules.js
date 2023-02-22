export const defaultVarsInit = {token:'',theme:'green',photo:'',saveConfigBrowser:false};
export const schema_vps= {
  name:{
    rules:[
            {
              name:'onlyNumberAndLetterSimbolsSpaces',
              message:'Letras, numeros y simbolos.',
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
              message:'Solo numeros y letras permitidos.',
            },
          ]
  },
}
export const schema_workers = {
  name:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:5,
              maxLength:20,
            },
          ]
  },
}
export const schema_collection = {
  name:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:5,
              maxLength:20,
            },
          ]
  },
}
export const schema_container = {
  name:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:5,
              maxLength:20,
            },
          ]
  },
  date_upload:{
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
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
            },
          ]
  },
  preplaning:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
            },
          ]
  },
  ppl_unloaded:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
            },
          ]
  },
  unl_time:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
            },
          ]
  },
  counted_hours:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
            },
          ]
  },
  ppl_counted:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
            },
          ]
  },
  stagung_pallets:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
            },
          ]
  },
  forklift_time:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
            },
          ]
  },
  ppl_forklift:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
            },
          ]
  },
  qc_time:{
    rules:[
            {
              name:'minMaxLength',
              message:'Minimo de caracteres 5 y maximo 10.',
              minLength:1,
              maxLength:20,
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