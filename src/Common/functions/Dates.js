import { DateTime, Duration, IANAZone } from "luxon";

let debug = false;

export function addDay(date) {
    var dt = date ? DateTime.fromISO(date) : DateTime.local();
    var result = null;
    if (date != null) {
        var dur = Duration.fromObject({ days: 1 });
        result = dt.plus(dur).toString();
    }
    else {
        result = dt.toString();
    }
    return result;
}

export function ago(date) {


    // function format(diff, divisor, unit, prev) {
    //     var val = Math.round(diff / divisor);
    //     return val <= 1 ? prev : val + ' ' + unit + 's ago';
    // }
    // var units = [
    //     { max: 2760000, value: 60000, name: 'minute', prev: 'a minute ago' },
    //     { max: 72000000, value: 3600000, name: 'hour', prev: 'an hour ago' },
    //     { max: 518400000, value: 86400000, name: 'day', prev: 'yesterday' },
    //     { max: 2419200000, value: 604800000, name: 'week', prev: 'last week' },
    //     { max: 28512000000, value: 2592000000, name: 'month', prev: 'last month' } // max: 11 months
    // ];

    // var diff = Math.abs(Date.now() - date.getTime());
    // // less than a minute
    // if (diff < 60000)
    //     return 'just now';
    // for (var i = 0; i < units.length; i++) {
    //     if (diff < units[i].max) {
    //         return format(diff, units[i].value, units[i].name, units[i].prev);
    //     }
    // }
    // return format(diff, 31536000000, 'year', 'last year');

    let result = DateTime.fromISO(date)
        .toRelative();
    if (debug) console.log(`ago: ${date} | ${result}`)

    return result;
}

export function getUtcFromZoned(zoneDate) {
    let result = DateTime
        .fromISO(zoneDate)
        .toUTC()
        .toISO();

    if (debug) console.log(`getUtcFromZoned: ${zoneDate} |  ${result}`)
    return result;
}

export function getUtcNow() {
    let result = DateTime.utc().toISODate();
    // if (debug) console.log(`getUtcNow: ${result}`)
    return result;
}

export function getUserJsDate(zoneName, utcDate) {
    const zone = new IANAZone(zoneName);
    let result = DateTime
        .fromISO(utcDate, { zone: 'utc' })
        .setZone(zone)
        .toJSDate();

    if (debug) console.log(`getUserJsDate: ${zoneName} ${utcDate} | ${result}`)
    return result;
}

export function getUtcFromJsDate(date) {
    let result = DateTime.fromJSDate(date).toUTC().toISO();

    if (debug) console.log(`getUtcFromJsDate: ${date} | ${result}`)
    return result;

}

//Filter name userISODate
export function getUserDate(zoneName, utcDate) {
    const zone = new IANAZone(zoneName);
    let result = DateTime
        .fromISO(utcDate, { zone: 'utc' })
        .setZone(zone)
        .toISODate(); 

    // if (debug) console.log(`getUserDate: ${zoneName}, ${utcDate} |  ${result}`)
    return result;
}

//Filter exposed as formattedDate
export function getUserDateString(utcDate, zoneName) {
    const zone = new IANAZone(zoneName);

    let formatedDate = DateTime
        .fromISO(utcDate)
        .setZone(zone)
        .toLocaleString({
            day: "2-digit",
            month: "2-digit",
            year: "2-digit"
        });
    if (formatedDate === "Invalid DateTime") {
        return "-";
    }
    return formatedDate;
}

export function moveDates(start, end, newStart) {
    let s = DateTime.fromISO(start, { zone: 'utc' })
    let e = DateTime.fromISO(end, { zone: 'utc' })
    let newStartD = DateTime.fromISO(newStart, { zone: 'utc' })

    let dur = e.diff(s, "days").toObject();
    let newEnd = newStartD.plus({ days: dur.days }).toISO();

    return { s: newStart, e: newEnd };
}

export function addDays(date, days) {
    let start = DateTime.fromISO(date, { zone: 'utc' });
    return start.plus({ days: days }).toISO();
}

export function smallerThan(date1, date2) {
    let date1UTC = DateTime.fromISO(date1, {zone: 'utc'});
    let date2UTC = DateTime.fromISO(date2, {zone: 'utc'});

    if (date1UTC < date2UTC) {
        return true;
    }

    return false;
}

export function largerThan(date1, date2) {
    let date1UTC = DateTime.fromISO(date1, {zone: 'utc'});
    let date2UTC = DateTime.fromISO(date2, {zone: 'utc'});

    if (date1UTC > date2UTC) {
        return true;
    }

    return false;
}

export default {
    addDay,
    addDays,
    ago,
    getUtcNow,
    getUserJsDate,
    getUserDateString,
    getUserDate,
    getUtcFromZoned,
    moveDates,
    getUtcFromJsDate,
    smallerThan,
    largerThan,
}