import React from "react"


const BluryContainer: React.FC<BluryContainerProps> = ({outerContainer, innerContainer, children})=>{

    return (
        <div {...outerContainer} className={`${outerContainer.className||''} bg-gray-500/35`}>
            <div {...innerContainer} className={`${innerContainer.className||''} bg-white backdrop-blur-md supports-[backdrop-filter]:bg-white/75`}>
                {children}
            </div>
        </div>
    )
}

export default BluryContainer


export interface BluryContainerProps {
    outerContainer: Omit<React.JSX.IntrinsicElements['div'], 'children'>
    innerContainer: Omit<React.JSX.IntrinsicElements['div'], 'children'>
    children?: React.ReactNode|React.JSX.Element
}