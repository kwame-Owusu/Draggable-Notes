class Note {
    constructor(title, description, id) {
        this.title = title;
        this.description = description;
        this.id = id || Date.now();  // Use a timestamp as a unique ID if not provided
        this.element = this.createNoteElement();
        this.setPosition();
        this.addDraggable();
    }

    createNoteElement() {
        const noteContainer = document.createElement("div");
        noteContainer.classList.add("note-container", "draggable");

        const titleElement = document.createElement("h3"); 
        titleElement.textContent = this.title;

        const hrElement = document.createElement("hr");

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = this.description;
        descriptionElement.contentEditable = "true";

        const delElement = document.createElement("button");
        delElement.textContent = "X";
        delElement.classList.add("delete-btn");
        delElement.addEventListener("click", () => this.removeNote());

        noteContainer.appendChild(titleElement);
        noteContainer.appendChild(hrElement);
        noteContainer.appendChild(descriptionElement);
        noteContainer.appendChild(delElement);

        // Set a random background color
        const noteBgColors = ["#D1E9F6", "#EECAD5", "#F6EACB", "#F6EACB", "#AAB396","#6482AD","#C4DAD2", "#91DDCF", "#ECB176"];
        const randomColor = noteBgColors[Math.floor(Math.random() * noteBgColors.length)];
        noteContainer.style.backgroundColor = randomColor;
        noteContainer.style.padding = "10px";  
        noteContainer.style.borderRadius = "10px"; 
        noteContainer.style.position = "absolute"; // Make the note position absolute
        noteContainer.style.width = "300px";
        noteContainer.style.zIndex = "1000";

        return noteContainer;
    }

    setPosition() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const randomX = Math.floor(Math.random() * (viewportWidth - 200));
        const randomY = Math.floor(Math.random() * (viewportHeight - 100));

        this.element.style.left = `${randomX}px`;
        this.element.style.top = `${randomY}px`;
        this.element.style.position = "absolute";
    }
    addDraggable() {
        // Use interact.js to make the element draggable
        interact(this.element).draggable({
            // Enable inertial throwing
            inertia: true,
            // Keep the element within the area of its parent
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            // Enable autoScroll
            autoScroll: true,

            // Call this function on every dragmove event
            onmove: event => {
                const target = event.target;
                // Keep the dragged position in the data attributes
                const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // Translate the element
                target.style.transform = `translate(${x}px, ${y}px)`;

                // Update the position attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }
        });
    }

    removeNote() {
        this.element.remove();
        // Remove from localStorage
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes = notes.filter(note => note.id !== this.id);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    appendTo(container) {
        container.appendChild(this.element);
    }
}

const addNoteBtn = document.getElementById("add-note-btn");
const noteTitleInput = document.getElementById("note-title");
const noteDescriptionInput = document.getElementById("note-description");
const notesContainer = document.querySelector(".notes-container");

addNoteBtn.addEventListener("click", () => {
    const noteTitle = noteTitleInput.value.trim();
    const noteDescription = noteDescriptionInput.value.trim();

    if (noteTitle && noteDescription) {
        const note = new Note(noteTitle, noteDescription);
        note.appendTo(notesContainer);

        // Save the note in localStorage
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push({ id: note.id, title: noteTitle, description: noteDescription });
        localStorage.setItem('notes', JSON.stringify(notes));

        noteTitleInput.value = "";
        noteDescriptionInput.value = "";
    } else {
        alert("Please enter note title and description.");
    }
    
});


// Load notes from localStorage on page load
window.onload = () => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    savedNotes.forEach(noteData => {
        const note = new Note(noteData.title, noteData.description, noteData.id);
        note.appendTo(notesContainer);
    });
};
