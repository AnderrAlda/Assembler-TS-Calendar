import * as type from "../interfaces/exportModule.js";
import { elements } from "../globalElements.js"
import { closeModal } from "./closeModal.js";
import { printMonth } from "../calendar/calendar.js";

export function paintDom(): void {
  const { modal } = elements;

  setModal();
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

export function paintDomDay(e: Event): void {
  const target = e.target as HTMLButtonElement;
  const btnDate = target.getAttribute("date") || "";
  const date = new Date(Date.UTC(parseInt(btnDate.split('-')[0]), parseInt(btnDate.split('-')[1]), parseInt(btnDate.split('-')[2])));
  const dateString = date.toJSON().split('.')[0];
  const { modal, modalInitialDate } = elements;
  
  modalInitialDate.value = dateString;

  setModal();

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function showTitleError(valueLength: number): void {
  const { modalTitleError } = elements;

  if (valueLength > 60) {
    modalTitleError.classList.remove("hidden");
  }
}

export function hideTitleError(): void {
  const { modalTitleError } = elements;

  modalTitleError.classList.add("hidden");
}

export function hideTitleFillError(): void {
  const { modalTitleErrorFill } = elements;

  modalTitleErrorFill.classList.add("hidden");
}

function showRemoveEndate(): void {
  const { modalEndDateCheck, modalEndDateContainer } = elements;

  if (modalEndDateCheck.checked) {
    modalEndDateContainer.classList.remove("hidden");
  } else {
    modalEndDateContainer.classList.add("hidden");
  }
}

function showRemoveTime(): void {
  const { modalTimeCheck, modalTimeLabel, modalTimeSelect } = elements;

  if (modalTimeCheck.checked) {
    modalTimeSelect.classList.remove("hidden");
    modalTimeLabel.classList.remove("hidden");
  } else {
    modalTimeSelect.classList.add("hidden");
    modalTimeLabel.classList.add("hidden");
  }
}

function validateTitleFill(): boolean {
  const { modalTitle, modalTitleErrorFill } = elements;

  if (modalTitle.value.trim() === "") {
    modalTitleErrorFill.classList.remove("hidden");
    return false; // Return false to indicate validation failure
  } else {
    modalTitleErrorFill.classList.add("hidden");
    return true; // Return true to indicate validation success
  }
}

function validateInitialDateFill(): boolean {
  const { modalInitialDate, modalInitialDateError } = elements;

  if (modalInitialDate.value.trim() === "") {
    modalInitialDateError.classList.remove("hidden");
    return false;
  } else {
    modalInitialDateError.classList.add("hidden");
    return true;
  }
}

export function hideInitialDateError(): void {
  const { modalInitialDateError } = elements;

  modalInitialDateError.classList.add("hidden");
}

function handleFormSub(): void {
  const { modalTitle, modalInitialDate, modalEndDateInput, modalComment, modalTimeSelect, modalEvent } = elements;
  
  const modalTitleValue = modalTitle.value;
  const modalInitialDateValue = modalInitialDate.value;
  const modalEndateValue = modalEndDateInput.value;
  const modalTimeValue = modalTimeSelect.value;
  const commentValue = modalComment.value;
  const modalEventValue = modalEvent.value;
  
  const calendar = localStorage.getItem("calendar") || "{'eventList':[], 'currentMonth':{}}";
  const JSONcalendar = JSON.parse(calendar);
  const currentMonth = JSONcalendar.currentMonth;
  let eventArray = JSONcalendar.eventList;
  let notificationStatus = modalTimeValue && new Date( modalInitialDateValue).getTime() > Date.now() ?false :true
  
  const newEvent: type.Event = {
    id: Date.now(),
    title: modalTitleValue,
    initialDate: modalInitialDateValue,
    endDate: modalEndateValue,
    alertTime: modalTimeValue,
    description: commentValue,
    eventType: modalEventValue,
    notificated: notificationStatus
  };
  
  eventArray.push(newEvent);
  localStorage.setItem("calendar", JSON.stringify(JSONcalendar));
  printMonth(currentMonth.year, currentMonth.id);
  closeModal();
}

export function setModal() {
  const { modal, modalForm, modalBtnCancel, modalBtnClose, modalTitle, modalEndDateCheck, modalTimeCheck, modalInitialDate } = elements;

  //press key scape to close modal
  document.addEventListener("keydown", function (event: KeyboardEvent) {
    if (event.key === "Escape" || event.key === "Esc") {
      closeModal();
    }
  });

  //press out modal to close it
  window.addEventListener('click', closeModalOut);
  function closeModalOut(event: MouseEvent) {
    if (event.target == modal) {
      closeModal();
    }
  }
  
  //press cancel to close modal
  modalBtnCancel.addEventListener("click", (event: MouseEvent) =>{
    event?.preventDefault();
    closeModal();
  });

  //modal title error control:
  modalTitle.addEventListener("blur", () =>
    showTitleError(modalTitle.value.length)
  );

  //clear title errors when input is been written:
  modalTitle.addEventListener("input", () => hideTitleError());
  modalTitle.addEventListener("input", () => hideTitleFillError());

  //modal endate show/hide with checkbox:
  modalEndDateCheck.addEventListener("change", () => showRemoveEndate());

  modalTimeCheck.addEventListener("change", () => showRemoveTime());

  //clear initial date errors when input is been written:
  modalInitialDate.addEventListener("input", () => hideInitialDateError());

  //validate the form is filled:
  modalForm.addEventListener("submit", function (event) {
    if (!validateTitleFill() || !validateInitialDateFill()) {
      event.preventDefault();
    } else {
      event.preventDefault();
      handleFormSub();
    }
  });

  modalBtnClose.addEventListener("click", (event) => {
      event.preventDefault();
      closeModal();
  });

}