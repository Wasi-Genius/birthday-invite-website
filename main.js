// Storage for all birthday data
let formData = {};

// Only allow number inputs for age and request number
document.getElementById('age').addEventListener('keydown', validateNumberInput);
document.getElementById('requestNumber').addEventListener('keydown', validateNumberInput);

function validateNumberInput(event) {
    if (!/[0-9\b]/.test(event.key) && event.key.length === 1){
        event.preventDefault();
    }
}

// Set the min date
let dateInput = document.getElementById('birthDate');
let currentDate = new Date();
let formattedDate = currentDate.toISOString().split('T')[0];
dateInput.setAttribute('min', formattedDate);
dateInput.setAttribute('value', formattedDate);


function resetForm() {
    console.log('Erasing all of this data: ', formData);

    document.getElementById('pageTitle').innerHTML = `Birthday Invite!`;

    // Disable modification of the initial form 
    let initialForm = document.getElementById("initialForm");
    initialForm.style.pointerEvents = "none";

    let divContainer = document.getElementById('initialForm'); 
    divContainer.querySelectorAll('input').forEach(input => {
        input.readOnly = false;
    });

    let newHeader = document.getElementById('inviteHeader')
    newHeader.textContent = "Create your very own birthday invite!"

    listOfDivsToReEnable = ['initialForm', 'listOfRequestsDiv'];

    listOfDivsToReEnable.forEach(id => {
        let element = document.getElementById(id);
        element.style.pointerEvents = "auto";
    });
 
    let containerDiv = document.getElementById('invitationForm')
    
    let divs = containerDiv.querySelectorAll('div')

    if (formData.birthdayTemplateCreated) {
        document.getElementById('birthdayTemplateDiv').classList.add('hidden')
        document.getElementById('createPDFDiv').classList.add('hidden');
        document.getElementById('initialForm').classList.remove('hidden')
    }

    else {
        divs.forEach(div => {
            if (div.id !== 'initialForm' && div.id !== 'resetButtonDiv') {
                div.classList.add('hidden');
            }
        });
    }

    const elementsToReset = ['listOfRequests', 'birthdayTemplate', 'displaySpecialMessage'];

    elementsToReset.forEach(elementId => {
        document.getElementById(elementId).textContent = '';
    });

    document.getElementById('displayList').innerHTML = '';

    let textFields = containerDiv.querySelectorAll('input[type="text"]')

    textFields.forEach(element => {
        element.value = ''
    });

    document.getElementById('birthDate').value = formattedDate
    document.getElementById('birthDate').style.opacity = 0.8;

    document.getElementById('initialFormButton').classList.remove('hidden');

    console.log('Reset completed.');

    formData = {};
}

function showSpecialRequestField() {
    formData.birthdayPerson = document.getElementById('birthdayPerson').value;
    formData.age = parseInt(document.getElementById('age').value);
   formData.birthDate = document.getElementById('birthDate').value;
    formData.address = document.getElementById('address').value;

    if (formData.birthdayPerson && formData.age && formData.birthDate && formData.address) {

        if (parseInt(formData.birthDate.split('-')[0]) < parseInt(formattedDate.split('-')[0])) {
            swal("Birthday party year cannot be less than current year.", '', "warning");
        }

        else if ((formData.birthDate.split('-')[0].length) > formattedDate.split('-')[0].length) {
            swal("Year in the incorrect format, must be in YYYY format.", '', "warning");
        }

        else if (parseInt(formData.birthDate.split('-')[1]) < parseInt(formattedDate.split('-')[1]) && formData.birthDate.split('-')[0] == formattedDate.split('-')[0]) {
            swal("Birthday party month cannot be before current month.", '', "warning");
        }

        else if (parseInt(formData.birthDate.split('-')[2]) < parseInt(formattedDate.split('-')[2]) && formData.birthDate.split('-')[0] == formattedDate.split('-')[0] && formData.birthDate.split('-')[1] == formattedDate.split('-')[1]) {
            swal("Birthday party day cannot be before current day.", '', "warning");
        }

        else {
            document.getElementById('specialRequestsHidden').classList.remove('hidden');
            document.getElementById('initialFormButton').classList.add('hidden');
            document.getElementById('birthDate').style.opacity = 1.0;
    
            // Disable modification of the initial form 
            let initialForm = document.getElementById("initialForm");
            initialForm.style.pointerEvents = "none";

            let divContainer = document.getElementById('initialForm'); 
            divContainer.querySelectorAll('input').forEach(input => {
                input.readOnly = true;
            });
        }

    } else {
        swal("Please fill in all birthday information before submitting.", '', "warning");
    }
}

function createRequests() {
    console.log('Creating request templates...');
    formData.numOfRequests = document.getElementById('requestNumber').value;

    if (parseInt(formData.numOfRequests, 10) > 0) {

        formData.ulElement = document.getElementById('listOfRequests');

        for (let i = 1; i <= formData.numOfRequests; i++) {
            const liElement = document.createElement('li');
            const inputElement = document.createElement('input');
            
            inputElement.type = 'text';
            inputElement.placeholder = 'Special Request';

            liElement.appendChild(inputElement);

            formData.ulElement.appendChild(liElement);
        }

        // Set the height of the list of requests for responsive sizing:

        let heightOfInputField = document.getElementById('birthdayPerson').clientHeight;

        if (parseInt(formData.numOfRequests, 10) <= 10) {
            let requestListHeight = heightOfInputField * parseInt(formData.numOfRequests, 10) / 2 + 20;
            document.getElementById('listOfRequests').style.height = requestListHeight + 'px';
        }

        else {
            let requestListHeight = heightOfInputField * parseInt(formData.numOfRequests, 10) / 2;
            document.getElementById('listOfRequests').style.height = requestListHeight + 'px';
        }
    
        document.getElementById('specialRequestsHidden').classList.add('hidden');
        document.getElementById('buttonForRequestStorage').classList.remove('hidden');
        
    } else {
        swal("Cannot have 0 requests or non-numeric values.", '', "warning");
    }

    document.getElementById('listOfRequestsDiv').classList.remove('hidden');

    console.log('Request templates created...');
}

function storeRequests() {
    console.log('Storing requests...');
    let liElements = formData.ulElement.getElementsByTagName('li');
    
    for (let i = 0; i < liElements.length; i++) {

        let inputElement = liElements[i].querySelector('input[type="text"]');
        let inputValue = inputElement.value.trim();

        if (inputValue === '') {
            swal("Please fill out all request fields.", '', "warning");
            return; 
        }

    }

    document.getElementById('specialMessageHidden').classList.remove('hidden');
    document.getElementById('buttonForRequestStorage').classList.add('hidden');

    // Disable modification of the requests
    let initialForm = document.getElementById("listOfRequestsDiv");
    initialForm.style.pointerEvents = "none";
    let divContainer = document.getElementById('listOfRequestsDiv'); 
    divContainer.querySelectorAll('input').forEach(input => {
        input.readOnly = true;
    });

    console.log('Requests:', formData.ulElement);
}

function storeMessage() {
    console.log('Storing message...');
    formData.sMessage = document.getElementById('specialMessage').value

    if (formData.sMessage === '') {
        swal("Please enter a message.", '', "warning");
    } else {
        createBirthdayInvite();
    }

    console.log('Message Stored:', formData.sMessage);
}

function createBirthdayInvite() {

    let newHeader = document.getElementById('inviteHeader')
    newHeader.textContent = "You're invited!"

    document.getElementById('birthdayTemplateDiv').classList.remove('hidden')

    let containerDiv = document.getElementById('invitationForm')
    
    let elements = containerDiv.querySelectorAll('div')

    elements.forEach(element => {
        if (element.id !== 'birthdayTemplateDiv' && element.id !== 'resetButtonDiv') {
            element.classList.add('hidden');
        }
    });

    document.getElementById('createPDFDiv').classList.remove('hidden');

    // Correct date format (mm-dd-yyyy)
    let originalDate = formData.birthDate;
    let parts = originalDate.split("-");
    let reversedDate = parts[1] + "-" + parts[2] + "-" + parts[0];
    let linkDate = originalDate.split("-").join("");

    // Get content of the special request list
    let listContent = "";
    formData.ulElement.querySelectorAll('li').forEach(liElement => {
        let listItemText = liElement.querySelector('input').value;
        listContent += `- ${listItemText}\n`;
    });

    let inviteLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${formData.birthdayPerson}'s birthday party!&dates=${linkDate}/${linkDate}&details=${encodeURIComponent(`Special Requests:\n${listContent}\n${formData.sMessage}`)}&location=${encodeURIComponent (formData.address)}`;

    let mapsLink = `https://www.google.com/maps/search/?api=1&query=${formData.address.split(' ').join('+')}`

    let inviteTemplate = document.getElementById('birthdayTemplate');

    inviteTemplate.innerHTML = `Come to ${formData.birthdayPerson}'s birthday party!\n${formData.birthdayPerson} is turning ${formData.age} years old on <a href="${inviteLink}" target="_blank">${reversedDate}</a>.\nThe birthday party is being held at <a href="${mapsLink}"target="_blank">${formData.address}</a>.`;

    formData.ulElement.querySelectorAll('li').forEach(liElement => {

        let newLElement = document.createElement('li');

        newLElement.textContent = liElement.querySelector('input').value;

        document.getElementById('displayList').appendChild(newLElement);

    });

    let specialMessageDisplay = document.getElementById('displaySpecialMessage')
    specialMessageDisplay.textContent = `${formData.sMessage}`

    formData.birthdayTemplateCreated = true
}

function turnInviteIntoPDF() {

    document.getElementById('pageTitle').innerHTML = `${formData.birthdayPerson}'s Birthday Invite!`;

    swal({
        title: "Remember to print in landscape with background graphics enabled for the best invitation format!",
        text: " ",
        icon: "info"
      })
      .then((willDelete) => {
        if (willDelete) {
            document.getElementById('resetButtonDiv').classList.add('hidden')
            document.getElementById('createPDFDiv').classList.add('hidden')
            window.print();
            document.getElementById('resetButtonDiv').classList.remove('hidden')
            document.getElementById('createPDFDiv').classList.remove('hidden')
        } 
      });
}

