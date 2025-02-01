import React from "react"


const BluryContainer: React.FC<BluryContainerProps> = ({outerContainer, innerContainer, children})=>{

    return (
        <div {...outerContainer} className={`${outerContainer.className||''} bg-blue-200/15`}>
            <div {...innerContainer} className={`${innerContainer.className||''} bg-white backdrop-blur-md supports-[backdrop-filter]:bg-white/45`}>
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