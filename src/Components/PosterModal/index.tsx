import { Modal, Box } from "@mui/material"
import { Suspense, useEffect, useState } from "react";
import './styles.css'

type prop = {
    children: any
    showPoster: boolean
    setShowPoster: (val: boolean) => void
}

const PosterModal: React.FC<prop> = ({ showPoster, setShowPoster, children }) => {
    const [open, setOpen] = useState<boolean>(false)

    const handleClose = () => {
        setOpen(false)
        setShowPoster(!showPoster)
    }

    useEffect(() => {
        setOpen(showPoster)
    }, [showPoster])

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='modalStyle1'>   
        <>
                <Box className='style'>
                    <Suspense fallback={<p>Loading Data</p>}>
                        {children}
                    </Suspense>
                </Box>
                <div className="closebutton">
                    <button onClick={() => setShowPoster(!showPoster)}>close</button>
                </div>
        </>
        </Modal>
    )
}
export default PosterModal