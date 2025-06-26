import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FormikContextType } from "formik";

export function useRevalidateOnLangChange<T>(formik: FormikContextType<T>) {
	const { i18n } = useTranslation();

	useEffect(() => {
		if (formik.submitCount > 0 || Object.keys(formik.errors).length > 0) {
			formik.validateForm();
		}
	}, [i18n.language]);
}
