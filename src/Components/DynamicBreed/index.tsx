import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { breedPayload } from "../../interface/apiResponse.interface";
import { imageData } from "../../interface/data.interface";
import { addImage } from "../../store/breedSlicer";
import { DogService } from "../../service/Dog.service"
import PosterModal from "../PosterModal";
import './styles.css';

const DynamicBreed: React.FC = () => {
    const initialPayload = { breedvar: [{ breed: undefined, subBreed: undefined, count: 1 }] }
    const breed = useSelector((state: RootState) => state.breed)
    const Images = useSelector((state: RootState) => state.Image)
    const [dogBreed] = useState<any>(breed)
    const [localfile, setlocalfile] = useState<imageData[]>(Images)
    const [dogbreedImage, setDogBreedImage] = useState<string[]>([])
    const [showPoster, setShowPoster] = useState<boolean>(false)
    const [lastImgData, setLastImgData] = useState<string[]>([])
    const dispatch = useDispatch()
    const dogService = new DogService()


    const breedSchema = Yup.object().shape({
        breedvar: Yup.array().of(Yup.object().shape({
            breed: Yup.string().required("Breed need to be selected"),
            subBread: Yup.string(),
            count: Yup.number().required('Count is needed').max(1000, "count can't exceed 1000").min(1, 'count must be greater than 0')
        }))
    })

    const shuffle = (data: string[], count: number, gen?: boolean): string[] => {
        data.sort(() => .5 - Math.random())
        if (count > data.length) {
            alert(`only ${data.length} Image is present`)
            return ['false']
        }
        else {
            let countdata: string[] = data.splice(0, count)
            if (!gen) {
                let sufflewhole: string[] = [...dogbreedImage, ...countdata]
                sufflewhole.sort(() => .5 - Math.random())
                setDogBreedImage(sufflewhole)
                return []
            }
            else {
                return countdata
            }
        }
    };

    const getDogImage = async (value: breedPayload, gen?: boolean): Promise<string[] | undefined> => {
        if (value) {
            try {
                if (localfile.length > 0) {
                    let data = localfile.find((x: imageData) => x.breedname === value.breed)
                    if (gen && data?.images) {
                        let sendval: string[] = [...data.images]
                        return sendval
                    }
                    else {
                        if (data?.images) {
                            const val: string[] = shuffle([...data.images], value.count, gen)
                            return val
                        }
                    }

                }
                const breeds: any = await dogService.getDogImage(value);
                if (breeds.status === 'success') {
                    let data: string[] = [...breeds.message]
                    if (gen) {
                        return data
                    }
                    const check: string[] = shuffle(data, value.count, gen)
                    let savebreedImage: imageData = { breedname: value.breed, images: data }
                    dispatch(addImage([...Images, savebreedImage]))
                    return check
                }
                else {
                    alert("something wrong with api")
                    return []
                }
            }
            catch (err: any) {
                alert(err.message)
                return []
            }
        }

    }

    const generatePoster = async (values: any): Promise<void> => {
        let val: any = await getDogImage(values.breedvar[values.breedvar.length - 1], true)
        let sufflelast: any = await shuffle(val, values.breedvar[values.breedvar.length - 1].count, true)
        sufflelast.sort(() => .5 - Math.random())
        setLastImgData(sufflelast)
        let data = dogbreedImage
        data.sort(() => .5 - Math.random())
        setDogBreedImage(data)
        setShowPoster(true)
    }
    const clearTable = (setdata: any): void => {
        setdata({ breedvar: [{ breed: '', subBreed: undefined, count: 1 }] })
        setDogBreedImage([])
    }
    const addNewBreed = async (value: any, setdata: any, error: any, gen?: boolean): Promise<void> => {
        if (!error) {
            if (value.breedvar[value.breedvar.length - 1].breed) {
                const check = await getDogImage(value.breedvar[value.breedvar.length - 1], gen)
                if (!gen) {
                    if (!check?.length) {
                        const newArr = [...value.breedvar, { breed: '', subBreed: undefined, count: 1 }]
                        setdata({ breedvar: newArr })
                    }
                }
            }
            else {
                alert('choose a breed for add another')
            }
        }
        else {
            alert('choose a breed for add another')
        }
    }
    useEffect(() => {
        setlocalfile(Images)
    }, [Images])

    useEffect(() => {
        setDogBreedImage(dogbreedImage)
    }, [dogbreedImage])

    return (
        <div className="maincontainer">
            <Formik
                initialValues={initialPayload}
                validationSchema={breedSchema}
                onSubmit={generatePoster}
            >
                {({ errors, values, touched, setValues }) => {
                    return (
                        <Form className='container'>
                            <FieldArray name="breedvar">
                                {() =>
                                    values?.breedvar.map((data: any, i: number) => {
                                        let breedErrors: any =
                                            (errors.breedvar?.length &&
                                                errors.breedvar) ||
                                            {};
                                        const breedTouched: any =
                                            (touched.breedvar?.length &&
                                                touched.breedvar[i]) ||
                                            {};
                                        return (<div className="hold" key={data.breed + i}>
                                            <div className="enclose">

                                                <Field
                                                    data-testid="breed"
                                                    name={`breedvar.${i}.breed`}
                                                    as="select"
                                                    className={
                                                        (breedErrors?.breed?.length && breedErrors?.breed && breedTouched?.breed && breedTouched?.breed
                                                            ? " is-invalid"
                                                            : "")
                                                    }
                                                    disabled={i !== (values.breedvar.length - 1)}
                                                >
                                                    {dogBreed && Object.keys(dogBreed).length > 0 ? <><option>Select Breed</option> {Object.keys(dogBreed).map((breed: any, index: number) => <option value={dogBreed.breed} key={breed}>{breed}</option>)}</> : <option>No Breed</option>}
                                                </Field>
                                                <ErrorMessage
                                                    name={`breedvar.${i}.breed`}
                                                    component="p"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                            <div className="enclose">
                                                <Field
                                                    name={`breedvar.${i}.subBreed`}
                                                    as="select"
                                                    className={
                                                        (breedErrors?.breed?.length && breedErrors?.breed && breedTouched?.breed && breedTouched?.breed
                                                            ? " is-invalid"
                                                            : "")
                                                    }
                                                    disabled={i !== (values.breedvar.length - 1)}
                                                >
                                                    {data.breed && dogBreed[data.breed]?.length > 0 ? <><option >Select sub-Breed</option> {dogBreed[data.breed].map((breed: any, index: number) => <option value={dogBreed.breed} key={breed}>{breed}</option>)}</> : <option>No sub-Breed</option>}
                                                </Field>
                                                <ErrorMessage
                                                    name={`breedvar.${i}.subBreed`}
                                                    component="p"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                            <div className="enclose">
                                                <Field
                                                    name={`breedvar.${i}.count`}
                                                    type="number"
                                                    className={
                                                        "form-control" +
                                                        (breedErrors.count && breedTouched.count
                                                            ? " is-invalid"
                                                            : "")
                                                    }
                                                    disabled={i !== (values.breedvar.length - 1)}
                                                />
                                                <ErrorMessage
                                                    name={`breedvar.${i}.count`}
                                                    component="p"
                                                    className="invalid-feedback"
                                                />
                                            </div>
                                            {i === (values.breedvar.length - 1) && <button onClick={() => addNewBreed(values, setValues, errors.breedvar)} type='button' className="add" data-testid="add">+</button>}
                                        </div>)
                                    })}
                            </FieldArray>
                            <div>
                                <button type='submit' data-testid="submit">Generate</button>
                                <button onClick={() => clearTable(setValues)} type='button' data-testid="clear" className="clearButton">clear</button>
                            </div>
                        </Form>)
                }}
            </Formik>
            <PosterModal showPoster={showPoster} setShowPoster={setShowPoster}>
                {[...lastImgData, ...dogbreedImage].sort(() => .5 - Math.random()).map((dog: string, index: number) => <img src={dog} key={dog + index} alt='img' />)}
            </PosterModal>
        </div>
    )
}
export default DynamicBreed