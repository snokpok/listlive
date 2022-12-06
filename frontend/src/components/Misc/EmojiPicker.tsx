import React from 'react'
import {Picker} from 'emoji-mart'

function EmojiPicker() {
    const [openPicker, setEmoji] = React.useState()

    return (
        <div>
            <Picker />
        </div>
    )
}

export default EmojiPicker
