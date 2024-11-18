import client from '../axios/client'

function Friends() {
    client.get('/friends');
    return (
        <>
        <div>
        Placeholder
        </div>
        </>
    )
}

export default Friends