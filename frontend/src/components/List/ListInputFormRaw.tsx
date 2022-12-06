import { InputFormRaw } from '@/common/interfaces/form-interfaces';
import React from 'react';

function ListInputFormRaw({
    formik,
    submitButtonValue,
    onCancel,
}: InputFormRaw & { onCancel?: Function }) {
    return (
        <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col rounded-lg border-2 border-gray-400 p-3"
        >
            <input
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                placeholder="Reading list!"
                autoComplete="off"
                className="border-transparent font-bold w-full p-2 focus:outline-none placeholder-gray-400"
            />
            <textarea
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                placeholder="An absolute necessity to your daily life"
                className="resize-none border-transparent focus:border-transparent focus:ring-transparent text-xs placeholder-gray-300"
            />
            <div className="flex space-x-1">
                <input
                    type="submit"
                    className={`bg-green-500 text-white w-24 rounded-lg h-7 self-center shadow ${
                        !!!formik.values.title ? 'cursor-not-allowed' : ''
                    } ${
                        !!!formik.values.title ? 'opacity-50' : ''
                    } transition cursor-pointer hover:bg-green-600
                    `}
                    value={submitButtonValue}
                />
                <input
                    type="button"
                    className={`bg-gray-400 border-2 border-gray-500 text-white w-2/4 rounded-lg h-7 self-center shadow cursor-pointer hover:bg-white hover:text-gray-600 transition`}
                    value="Cancel"
                    onClick={() => {
                        if (onCancel) onCancel();
                    }}
                />
            </div>
        </form>
    );
}

export default ListInputFormRaw;
