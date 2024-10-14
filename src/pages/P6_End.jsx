// Imports.
import Container from "bmt-template-components-container";
import Text from "bmt-template-components-text";
import Title from "bmt-template-components-title";

import { useTranslation } from "react-i18next";
import {useContext} from "react";
import globalContext from "../context";

// The component.
const P6_End = (props) => {
    // Mandatory definitions.
    const { t, i18n } = useTranslation();

    // Import parameters and helper functions from global context.
    // const { parameter, validation, c, n, relativeDate, state, setState } = useContext(globalContext);

    return (
        <Container>
            <Title>{t("end-title")}</Title>
            <Text>{t("end-text-1")}</Text>

        </Container>
    );
};


// Export.
export default P6_End;


