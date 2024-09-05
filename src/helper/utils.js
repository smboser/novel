export function differenceDate(date_past, date_now) {
        let date_past_time = date_past.getTime();
        let date_now_time  = date_now.getTime();

        var delta = Math.abs(date_now_time - date_past_time) / 1000;

        // calculate (and subtract) whole days
        let days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        let hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        let minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        let seconds = Math.floor(delta % 60);

        let diff = "";
        if(days > 0) {
            diff = `${days}D`
        }
        if(hours > 0) {
            diff = `${diff} ${hours}H`
        }
        if(minutes > 0) {
            diff = `${diff} ${minutes}M`
        }
        if(seconds > 0) {
            diff = `${diff} ${seconds}S`
        }
        return diff;

}