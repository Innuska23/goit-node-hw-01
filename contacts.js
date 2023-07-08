
const path = require('node:path');
const fsPromises = require('fs').promises;


const contactsPath = path.join(__dirname, 'db', 'contacts.json')

function makeId(length = 21) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

async function readListContacts() {
    try {
        const buffer = await fsPromises.readFile(contactsPath)
        const listContact = JSON.parse(buffer)

        return listContact
    } catch (e) {
        return []
    }
}

async function writeListContacts(list) {
    try {
        const listAsString = JSON.stringify(list)
        await fsPromises.writeFile(contactsPath, listAsString)

        return listAsString
    } catch (e) {
        throw new Error('Something went wrong while write to file')
    }
}

async function listContacts() {
    const listContacts = await readListContacts()

    return listContacts
}

async function getContactById(contactId) {
    const list = await readListContacts()
    const contact = list.find(({ id }) => id === contactId)

    return contact ?? null
}

async function removeContact(contactId) {
    const list = await readListContacts()
    let result = null
    const filteredContacts = list.filter((item) => {
        if (item.id !== contactId) {
            return true
        }
        result = item

    })
    await writeListContacts(filteredContacts)

    return result
}

async function addContact(name, email, phone) {
    const list = await readListContacts()
    const newContact = { id: makeId(), name, email, phone }
    list.push(newContact)
    await writeListContacts(list)

    return newContact
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
} 