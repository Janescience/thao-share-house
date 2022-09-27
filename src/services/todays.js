import http from '@/constants/api';
import authHeader from './auth-header'
import { setCountSendToday,setCountReceiveToday } from '@/utils'
import { useMainStore } from '@/stores/main';


const module = '/toDay' 
class ToDaysService{
    getToDayAmountReceive(){
        return http.get(module + '/amountReceive',{ headers : authHeader()})
                .then(response => {
                    setCountReceiveToday(response.data.data.length)
                    useMainStore().setCountReceiveToday(response.data.data.length)
                    return response;
                })
    }
    getToDayAmountReceiveDetail(memberId){
        return http.get(module + '/amountReceiveDetail?memberId='+memberId,{ headers : authHeader()})
                .then(response => {
                    setCountReceiveToday(response.data.data.length)
                    useMainStore().setCountReceiveToday(response.data.data.length)
                    return response;
                })
    }
    setReceiveCancel(memberId){
        return http.put(module + `/receiveCancel?memberId=${memberId}`,null,{ headers : authHeader()});
                
    }
    setReceiveComplete(memberId){
        return http.put(module + `/receiveComplete?memberId=${memberId}`,null,{ headers : authHeader()});
                
    }
}

export default new ToDaysService()