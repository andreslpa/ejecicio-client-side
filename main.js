const url_events =  "https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json";

fetch(url_events).then(response => response.json()).then( data => {
    let events = {};
    //Get list of events
    for(let key in data){
        let entry = data[key];
        let entryEvents = entry.events;
        for(let key in entryEvents){
            let event = entryEvents[key];
            if(!(event in  events)){
                events[event] = {
                    name: event,
                    trueNegatives: 0,
                    truePositives: 0,
                    falsePositives: 0,
                    falseNegatives: 0,
                    mcc: 0,
                }
            }
        }   
    }
    //Calculate TP, TN, FP, FN
    for(let key in data){
        let entry = data[key];
        let entryEvents = entry.events;
        let squirrel = entry.squirrel;

        if(squirrel){
            for(let key in events){
                let event = events[key];
                if(entryEvents.includes(key)){
                    event.truePositives++;
                } else {
                    event.falsePositives++;
                }
            }
        } else {
            for(let key in events){
                let event = events[key];
                if(entryEvents.includes(key)){
                    event.falseNegatives++;
                } else {
                    event.trueNegatives++;
                }
            }
        }
    }
    // Calculate MCC
    for(let key in events){
        let event = events[key];
        event.mcc = (event.trueNegatives*event.truePositives-event.falsePositives*event.falseNegatives)/Math.sqrt((event.truePositives + event.falsePositives)*(event.truePositives+event.falseNegatives)*(event.trueNegatives+event.falsePositives)*(event.trueNegatives+event.falseNegatives));
    }
    // Sort events
    let items = Object.keys(events).map(function(key) {
        return [key, events[key].mcc];
    });

    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    // Create table in DOM
    
    let tbody = document.getElementById("events_correlation");
    
    for (let i = 0; i < items.length; i++) {

        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.scope = "row";
        th.innerText = i;
        tr.appendChild(th);
        let td1 = document.createElement("td");
        td1.innerText = items[i][0];
        tr.appendChild(td1);
        let td2 = document.createElement("td");
        td2.innerText = items[i][1];
        tr.appendChild(td2);
        tbody.appendChild(tr);
    }

    

}
);


