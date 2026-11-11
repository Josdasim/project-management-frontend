export function fieldErrorsFromApiError(error){
    const result = {}

    if(!Array.isArray(error.detail)) return result

    for(const item of error.detail){
        const field = item.loc?.[item.loc.length -1]

        if(typeof field === 'string' && !(field in result)){
            result[field] = item.msg
        }
    }
    return result
}