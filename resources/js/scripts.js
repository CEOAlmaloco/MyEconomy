        // Función para generar un nuevo ID de transacción
        function getNewTransactionId() {
            let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";
            let newTransactionId = JSON.parse(lastTransactionId) + 1;
            localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
            return newTransactionId;
        }

        // Función para convertir los datos del formulario en un objeto de transacción
        function convertFormDataToTransactionObj(transactionFormData) {
            let transactionType = transactionFormData.get("transactionType");
            let transactionDescription = transactionFormData.get("transactionDescription");
            let transactionAmount = transactionFormData.get("TransactionAmount");
            let transactionCategory = transactionFormData.get("transactionCategory");
            let transactionId = getNewTransactionId(); // Generar un nuevo ID
            return {
                "transactionType": transactionType,
                "transactionDescription": transactionDescription,
                "transactionAmount": transactionAmount,
                "transactionCategory": transactionCategory,
                "transactionId": transactionId // Guardar el ID en el objeto
            };
        }

        // Función para guardar una transacción en el localStorage
        function saveTransactionObj(transactionObj) {
            let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];
            myTransactionArray.push(transactionObj);
            let transactionArrayJSON = JSON.stringify(myTransactionArray);
            localStorage.setItem("transactionData", transactionArrayJSON);
        }

        // Función para insertar una fila en la tabla de transacciones
        function insertRowInTransactionTable(transactionObj) {
            let transactionTableRef = document.getElementById("transactionTable");
            let newTransactionRowRef = transactionTableRef.insertRow(-1);
            newTransactionRowRef.setAttribute("data-transaction-id", transactionObj["transactionId"]);

            let newTypeCellRef = newTransactionRowRef.insertCell(0);
            newTypeCellRef.textContent = transactionObj["transactionType"];

            newTypeCellRef = newTransactionRowRef.insertCell(1);
            newTypeCellRef.textContent = transactionObj["transactionDescription"];

            newTypeCellRef = newTransactionRowRef.insertCell(2);
            newTypeCellRef.textContent = transactionObj["transactionAmount"];

            newTypeCellRef = newTransactionRowRef.insertCell(3);
            newTypeCellRef.textContent = transactionObj["transactionCategory"];

            let newDeleteCell = newTransactionRowRef.insertCell(4);
            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            newDeleteCell.appendChild(deleteButton);

            // Evento para eliminar la transacción
            deleteButton.addEventListener("click", (event) => {
                let transactionRow = event.target.parentNode.parentNode;
                let transactionId = transactionRow.getAttribute("data-transaction-id");
                transactionRow.remove();
                deleteTransactionObj(transactionId); // Eliminar del localStorage
            });
        }

        // Función para eliminar una transacción del localStorage
        function deleteTransactionObj(transactionId) {
            let transactionObjArr = JSON.parse(localStorage.getItem("transactionData")) || [];
            let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId == parseInt(transactionId));
            if (transactionIndexInArray !== -1) {
                transactionObjArr.splice(transactionIndexInArray, 1);
                let transactionArrayJSON = JSON.stringify(transactionObjArr);
                localStorage.setItem("transactionData", transactionArrayJSON);
                console.log("Transacción eliminada:", transactionId);
            } else {
                console.error("Transacción no encontrada:", transactionId);
            }
        }

        // Evento para manejar el envío del formulario
        const form = document.getElementById("transactionForm");
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            let transactionFormData = new FormData(form);
            let transactionObj = convertFormDataToTransactionObj(transactionFormData);
            saveTransactionObj(transactionObj);
            insertRowInTransactionTable(transactionObj);
        });

        function drawCategory(){
            let allCategories = [
                "Alquiler",
                "Comida",
                "Diversion",
                "Antojo",
                "Gasto",
                "Transporte"
            ]

            for(let index =0; index < allCategories.length; index++){
                insertCategory(allCategories[index])
            }/*-----NO SE QUE MIERDA PASO ACA XDD----- */


        }

        function insertCategory(categoryName){
            const selectElement = document.getElementById("transactionCategory")
            let htmlToInsert = `<option> ${categoryName} </option>`
            selectElement.insertAdjacentHTML("beforeend",htmlToInsert)
        }

        // Cargar transacciones guardadas al cargar la página
        document.addEventListener("DOMContentLoaded", function (event) {
            drawCategory();
            let transactionObjArr = JSON.parse(localStorage.getItem("transactionData")) || [];
            transactionObjArr.forEach(function (arrayElement) {
                insertRowInTransactionTable(arrayElement);
            });
        });