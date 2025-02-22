
const paramsRegExp = /<:\=[\s]*.*?[\s]*>/gs;

const addScript = (match: string) => `const PARAM = Params, param = Params; return ${match}`;
export const convertBodyStringToObject = (bodyString: string) => {
  try {
    return new Function(`return ${bodyString}`)();
  } catch (err) {
    return bodyString;
  }
}

export const parseResponseBody = (
  bodyString: string,
  params: {
    [k: string]: string | string[];
  } = {}
) => {

    if(Object.keys(params).length < 1) return bodyString;

    const matches = bodyString.match(paramsRegExp);
    if(!matches) return bodyString;

    // const id = `${Math.random()}_${Date.now()}`
    let match = '';
    let dynamicMethod: Function;
    let dynamicValue; 
    for(let i = 0; i < matches.length; i++ ){
        match = matches[i].replace(/<:\=[\s]*/, '').replace(/([\s]*>)$/,'');
        dynamicMethod = (new Function('Params', addScript(match)));
        try{
            dynamicValue = dynamicMethod(params);
        }catch(err){
            dynamicValue = `<ERROR>`;
        }

        bodyString = bodyString.replace(matches[i], dynamicValue);
    }



  return bodyString;
};

export const getUniqueID = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};


