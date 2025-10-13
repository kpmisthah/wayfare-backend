export class RefundPolicyEntity {
    static calculateRefund(travelDate:Date):number{
        let start = travelDate.getTime()
        let current = new Date().getTime()
        let timeDifference = start - current
        let duration = timeDifference/(1000*3600*24)
        if(duration>7){
            return 100
        }
        if(duration>=4 && duration<7){
            return 50
        }
        return 0
    }
}