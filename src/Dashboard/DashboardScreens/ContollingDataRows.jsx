import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import nft from '../../../public/assets/images/nft-2.png'
function ControllingDataRows() {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const NavigateToUser = () => {
        navigate('/dashboard/controlling-content/user-1')
    }
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (

        <tr onClick={NavigateToUser}>
            <td>01</td>
            <td>
                4
            </td>
            <td>Naqi</td>
            <td>xasda2678xafasqw897654as</td>
            <td>naqi@pluton.com</td>
            <td>00 000 0000000</td>


        </tr>

    )
}

export default ControllingDataRows