let production_table = document.getElementById("production-table");
let cost_pool_table = document.getElementById("cost-pool-table");
let answer_table = document.getElementById("answer-table");
let tables = [production_table, cost_pool_table, answer_table];

function AddColumn() {
    [...document.querySelectorAll("#production-table tr")].forEach((row, index) => {
        let input = document.createElement("input");
        input.setAttribute("class", index === 0 ? "production-table-project-name" : "production-table-input");
        input.setAttribute("type", index === 0 ? "text" : "number");
        input.setAttribute("value", index === 0 ? "" : 0);
        
        let cell = document.createElement(index ? "td" : "th");
        cell.setAttribute("class", index === 0 ? "production-table-column-header" : "production-table-cell");
        cell.appendChild(input);
        
        row.appendChild(cell);
    });
};

function RemoveColumn() {
    let column_count = production_table.rows[0].cells.length;
    let new_columns = column_count - 4;
    
    let row_count = production_table.rows.length;
    
    if (new_columns > 0) {
        for (let i = 0 ; i < row_count ; i++) {
            production_table.rows[i].deleteCell(column_count - 1);
        }
    }
}

function AddRow(table) {
    let column_count = tables[table].rows[0].cells.length;
    
    let new_row = tables[table].insertRow(-1);
    for (let i = 0 ; i < column_count ; i++) {
        let new_cell = new_row.insertCell(i);
        
        if (table === 0) {
            let input = document.createElement("input");
            input.setAttribute("class", i === 0 ? "production-table-row-header" : 
                                        i === 1 ? "production-table-checkbox" :
                                                  "production-table-input");
            input.setAttribute("type", i === 0 ? "text" :  
                                       i === 1 ? "checkbox" :
                                                 "number");
            input.setAttribute("value", i > 1 ? 0 : "");

            new_cell.appendChild(input);
        } else {
            let input = document.createElement("input");
            input.setAttribute("class", i === 0 ? "row-header-input-cost-pool" :
                                        i === 1 ? "annual-cost" : 0);
            input.setAttribute("type", i === 0 ? "text" :
                                       i === 1 ? "number" : 0);
            
            let dropdown = document.createElement("select");
            dropdown.setAttribute("class", "cost-driver-dropdown");
            
            let span = document.createElement("span");
            span.setAttribute("class", "cost-pool-table-other");
            
            new_cell.appendChild(i < 2 ? input :
                                 i === 2 ? dropdown :
                                 span);
        }
    }
}

function RemoveRow(table) {
    let row_count = tables[table].rows.length;
    let new_rows = table === 0 ? row_count - 5 : row_count - 1;
    
    if (new_rows > 0) {
        tables[table].deleteRow(row_count - 1);
    }
}

function Reset(table) {
    let column_count = tables[table].rows[0].cells.length;
    let new_columns = column_count - 3;
    
    let row_count = tables[table].rows.length;
    let new_rows = table === 0 ? row_count - 4 : row_count;
    
    while (--new_columns > 0) {
        RemoveColumn(table);
    }
    while (--new_rows > 0) {
        RemoveRow(table);
    }
    
    let column_headers = document.getElementsByClassName("production-table-project-name");
    column_headers[0].value = "Project A";
    column_headers[1].value = "Project B";
    
    let checkboxes = document.getElementsByClassName("production-table-checkbox");
    for (let i = 0 ; i < checkboxes.length ; i++) {
        checkboxes[i].checked = false;
    }
    
    let inputs = document.getElementsByClassName("production-table-input");
    for (let i = 0 ; i < inputs.length ; i++) {
        inputs[i].value = 0;
    }
}

function UpdateDropdown() {
    let dropdown = document.getElementsByClassName("cost-driver-dropdown");
    for (let i = 0 ; i < dropdown.length ; i++) {
        for (let j = dropdown[i].options.length - 1 ; j >= 0 ; j--) {
            dropdown[i].remove(j);
        }
    }
    
    let cost_pools = document.getElementsByClassName("production-table-row-header");
    let cost_pools_array = [];
    for (let i = 4 ; i < cost_pools.length ; i++) {
        cost_pools_array.push(cost_pools[i].value);
    }
    
    for (let i = 0 ; i < dropdown.length ; i++) {
        for (let j = 0 ; j < cost_pools_array.length ; j++) {
            let current_option = cost_pools_array[j];
            let element = document.createElement("option");
            element.textContent = current_option;
            element.value = current_option;
            dropdown[i].appendChild(element);
        }
    }
    
    let OAR_dropdown = document.getElementById("OAR-dropdown");
    
    let units_option = document.createElement("option");
    units_option.textContent = "Units";
    units_option.value = "Units";
    
    let labour_hours_option = document.createElement("option");
    labour_hours_option.textContent = "Direct Labour Hours";
    labour_hours_option.value = "Direct Labour Hours";
    
    OAR_dropdown.appendChild(units_option);
    OAR_dropdown.appendChild(labour_hours_option);
    
    for (let i = 0 ; i < cost_pools_array.length ; i++) {
        let option = cost_pools_array[i];
        let element = document.createElement("option");
        element.textContent = option;
        element.value = option;
        OAR_dropdown.appendChild(element);
    }
}

function ResetAnswerTable() {
    let column_count = answer_table.rows[0].cells.length;
    let new_columns = column_count - 1;
    
    let row_count = answer_table.rows.length;
    let new_rows = row_count - 1;
    
    for (let i = 0 ; i < new_columns ; i++) {
        for (let i = 0 ; i < row_count ; i++) {
            answer_table.rows[i].deleteCell(1);
        }
    }
    for (let i = 0 ; i < new_rows ; i++) {
        answer_table.deleteRow(1);
    }
}

function Calculate() {
    ResetAnswerTable();
    
    let table_contents_class = document.getElementsByClassName("production-table-input");
    let table_contents = [];
    for (let i = 0 ; i < table_contents_class.length ; i++) {
        table_contents.push(table_contents_class[i].value);
    }
    
    let row_headers_class = document.getElementsByClassName("production-table-row-header");
    let row_headers = [];
    for (let i = 0 ; i < row_headers_class.length ; i++) {
        row_headers.push(row_headers_class[i].innerHTML || row_headers_class[i].value);
    }
    
    let dropdown_class = document.getElementsByClassName("production-table-checkbox");
    let dropdown = [];
    for (let i = 0 ; i < dropdown_class.length ; i++) {
        dropdown.push(dropdown_class[i].checked ? 1 : 0);
    }
    
    let ticked = {};
    for (let i = 0 ; i < row_headers.length ; i++) {
        ticked[row_headers[i]] = dropdown[i];
    }
    
    let column_count = production_table.rows[0].cells.length - 2;
    let table_row_contents = [];
    for (let i = 0 ; i < table_contents.length ; i += column_count) {
        let chunk = table_contents.slice(i, i + column_count);
        table_row_contents.push(chunk);
    }
    
    for (let i = 0 ; i < table_row_contents.length ; i++) {
        table_row_contents[i].push(dropdown[i]);
    }
    
    let production_data = {};
    for (let i = 0 ; i < row_headers.length ; i++) {
        production_data[row_headers[i]] = table_row_contents[i];
    }
    
    let annual_costs_class = document.getElementsByClassName("annual-cost");
    let annual_costs = [];
    for (let i = 0 ; i < annual_costs_class.length ; i++) {
        annual_costs.push(annual_costs_class[i].value);
    }
    
    let cost_driver_dropdown = document.getElementsByClassName("cost-driver-dropdown");
    let cost_driver = [];
    for (let i = 0 ; i < cost_driver_dropdown.length ; i++) {
        cost_driver.push(cost_driver_dropdown[i].value);
    }
    
    /*------------------------------------------------------------------------*/
    
    let sum_array = [];
    for (let i = 0 ; i < annual_costs.length ; i++) {
        let current_annual_cost_driver = cost_driver[i];
        let production_data_cost_driver_row = production_data[current_annual_cost_driver];
        
        let sum = 0;
        for (let j = 0 ; j < production_data_cost_driver_row.length - 1; j++) {
            let checked  = production_data_cost_driver_row[production_data_cost_driver_row.length - 1];
            sum += checked ? parseInt(production_data_cost_driver_row[j]) * parseInt(production_data["Units"][j]) :
                parseInt(production_data_cost_driver_row[j]);
        }
        sum_array.push(sum);
    }
    let CDPU_array = [];
    for (let i = 0 ; i < annual_costs.length ; i++) {
        CDPU_array.push(annual_costs[i] / sum_array[i]);
    }
    
    let cost_pool_units = document.getElementsByClassName("cost-pool-table-other");
    for (let i = 0 ; i < cost_pool_units.length ; i++) {
        cost_pool_units[i].innerHTML = i % 2 === 0 ? sum_array[i / 2] : CDPU_array[(i - 1) / 2];
    }
    
    let column_title_count = document.getElementsByClassName("production-table-project-name");
    for (let i = 0 ; i < column_title_count.length ; i++) {
        [...document.querySelectorAll("#answer-table tr")].forEach((row, index) => {
            let span = document.createElement("span");
            span.setAttribute("class", "answer-table-title");
            
            let cell = document.createElement(index ? "td" : "th");

            cell.appendChild(span);
            row.appendChild(cell);
        });
    }
    
    let answer_table_header = document.getElementsByClassName("answer-table-title");
    for (let i = 0 ; i < answer_table_header.length ; i++) {
        answer_table_header[i].innerHTML = column_title_count[i].value || column_title_count[i].innerHTML;
    }
    
    let overhead_pools_class = document.getElementsByClassName("row-header-input-cost-pool");
    let overhead_pools = [];
    for (let i = 0 ; i < overhead_pools_class.length ; i++) {
        overhead_pools.push(overhead_pools_class[i].value);
    }
    
    for (let i = 0 ; i < overhead_pools.length ; i++) {
        let new_row = answer_table.insertRow(-1);
        for (let j = 0 ; j < answer_table_header.length + 1 ; j++) {
            let new_cell = new_row.insertCell(j);
            
            let span = document.createElement("span");
            span.setAttribute("class", j === 0 ? "overhead" : "answer-table-cell");
            
            new_cell.appendChild(span);
        }
    }
    let answer_table_overheads = document.getElementsByClassName("overhead");
    for (let i = 0 ; i < answer_table_overheads.length ; i++) {
        answer_table_overheads[i].innerHTML = overhead_pools[i];
    }
    
    let answer_table_cells = document.getElementsByClassName("answer-table-cell");
    let answer_table_data = [];
    for (let i = 0 ; i < answer_table_overheads.length ; i++) {
        let current_cost_driver = cost_driver[i];
        let production_data_row = production_data[current_cost_driver];
        
        let row_data = [];
        for (let j = 0 ; j < production_data_row.length - 1 ; j++) {
            row_data.push(ticked[cost_driver[i]] ? (CDPU_array[i] * production_data_row[j] * production_data["Units"][j]) :
                          (CDPU_array[i] * production_data_row[j]));
        }
        answer_table_data.push(row_data);
    }
    
    for (let i = 0 ; i < answer_table_cells.length ; i++) {
        answer_table_cells[i].innerHTML = answer_table_data.flat()[i];
    }
    
    let answer_sum_array = [];
    for (let i = 0 ; i < answer_table_data[0].length ; i++) {
        let sum = 0;
        answer_table_data.forEach(a => sum += a[i]);
        answer_sum_array.push(sum);
    }
    
    let answer_overhead_per_unit = [];
    for (let i = 0 ; i < answer_sum_array.length ; i++) {
        answer_overhead_per_unit.push(answer_sum_array[i] / production_data["Units"][i]);
    }
    
    let final_costs = [];
    for (let i = 0 ; i < answer_overhead_per_unit.length ; i++) {
        final_costs.push(answer_overhead_per_unit[i] + parseFloat(production_data["Direct Materials"][i]) +
                        (parseFloat(production_data["Direct Labour Rate"][i]) * parseFloat(production_data["Direct Labour Hours"][i])));
    }
    
    for (let i = 0 ; i < 3 ; i++) {
        let column_count = answer_table.rows[0].cells.length;
        let new_row = answer_table.insertRow(-1);
        
        for (let j = 0 ; j < column_count ; j++) {
            let new_cell = new_row.insertCell(0);
            
            let span = document.createElement("span");
            span.setAttribute("class", i === 0 ? "final_cost" :
                                       i === 1 ? "cost_driver_rate" :
                                       i === 2 ? "total_cost" :
                                       0);
            new_cell.appendChild(span);
        }
    }
    let final_cost_row = document.getElementsByClassName("final_cost");
    for (let i = 1 ; i < final_cost_row.length ; i++) {
        final_cost_row[0].innerHTML = "Total Overhead";
        final_cost_row[0].style.color = "green";
        final_cost_row[0].style.fontWeight = "bold";
        
        final_cost_row[i].innerHTML = answer_sum_array[i - 1];
        final_cost_row[i].style.color = "green";
        final_cost_row[i].style.fontWeight = "bold";
    }
    let cost_driver_rate_row = document.getElementsByClassName("cost_driver_rate");
    for (let i = 0 ; i < cost_driver_rate_row.length ; i++) {
        cost_driver_rate_row[i].innerHTML = answer_overhead_per_unit[i - 1] || "Overhead Per Unit";
        cost_driver_rate_row[i].style.color = "green";
        cost_driver_rate_row[i].style.fontWeight = "bold";
    }
    let total_cost_row = document.getElementsByClassName("total_cost");
    for (let i = 0 ; i < total_cost_row.length ; i++) {
        total_cost_row[i].innerHTML = final_costs[i - 1] || "Total Cost Per Unit";
        total_cost_row[i].style.color = "green";
        total_cost_row[i].style.fontWeight = "bold";
    }
    
    /*------------------------------------------------------------------------*/
    
    let OAR_dropdown = document.getElementById("OAR-dropdown");
    let chosen_OAR_basis = OAR_dropdown.value;
    
    let OAR_value_production_row = production_data[chosen_OAR_basis];
    let OAR_value_sum = 0;
    for (let i = 0 ; i < OAR_value_production_row.length - 1 ; i++) {
        if (chosen_OAR_basis != "Units") {
            OAR_value_sum += parseFloat(OAR_value_production_row[i] * parseFloat(production_data["Units"][i]));
        } else {
            OAR_value_sum += parseFloat(OAR_value_production_row[i])
        }
    }
    
    let annual_costs_sum = 0;
    for (let i = 0 ; i < annual_costs.length ; i++) {
        annual_costs_sum += parseFloat(annual_costs[i]);
    }
    
    let OAR_rate = annual_costs_sum / OAR_value_sum;
    
    let distributed_OAR = [];
    for (let i = 0 ; i < OAR_value_production_row.length - 1; i++) {
        if (chosen_OAR_basis != "Units") {
            distributed_OAR.push(OAR_value_production_row[i] * OAR_rate);
        } else {
            distributed_OAR.push(OAR_rate);
        }
    }
    
    let OAR_final = [];
    for (let i = 0 ; i < distributed_OAR.length ; i++) {
        OAR_final.push(parseFloat(distributed_OAR[i]) + parseFloat(production_data["Direct Materials"][i]) +
                      (parseFloat(production_data["Direct Labour Rate"][i]) * parseFloat(production_data["Direct Labour Hours"][i])));
    }
    
    let class_to_remove = document.getElementsByClassName("OAR-answer");
    while (class_to_remove.length > 0) {
        class_to_remove[0].parentNode.removeChild(class_to_remove[0]);
    }
    
    let OAR_answer_div = document.getElementById("OAR-answer-div");
    for (let i = 0 ; i < OAR_final.length ; i++) {
        let span = document.createElement("span");
        span.setAttribute("class", "OAR-answer");
        
        OAR_answer_div.appendChild(span);
    }
    let OAR_answer_class = document.getElementsByClassName("OAR-answer");
    for (let i = 0 ; i < OAR_answer_class.length ; i++) {
        OAR_answer_class[i].innerHTML = OAR_final[i] + " _ ";
    }
}



















