export const schema = {
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
    company:{  
            rules:[
                    {
                      name:'onlyNumberAndLetterSimbolsSpaces',
                      message:'Numero y letras. Simbolos permitidos [@,.,-,_,#]'
                    },
                  ]
            },
    company_ssid:{  
                    rules:[
                            {
                              name:'onlyNumber',
                              message:'Solo se Permiten Numeros'
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
                        {
                          name:'isUnique',
                          message:'Correo Electronico ya registrado.'
                        },
                      ]
          },
  }