import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import { SlCalender } from "react-icons/sl";
import Input from "../../ui/Input";
import "../../styles/datepicker.css";
import { useSettings } from "../settings/useSettings";

function CreateBookingForm() {
  const { settings, isLoading: settingIsLoading } = useSettings();

  const {
    register,
    control,
    handleSubmit,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    shouldFocusError: false,
  });

  // Prevent rendering until settings are loaded
  if (settingIsLoading) {
    return <p className="text-m pr-10">Loading settings...</p>;
  }

  // Ensure minBookinLength is available and is a valid number
  const minBookinLength = settings.minBookinLength ?? 0;

  const startDate = watch("startDate");

  function onSubmit(data) {
    const formattedData = {
      ...data,
      startDate: data.startDate
        ? format(new Date(data.startDate), "yyyy-MM-dd HH:mm:ss")
        : null,
      endDate: data.endDate
        ? format(new Date(data.endDate), "yyyy-MM-dd HH:mm:ss")
        : null,
    };

    console.log(formattedData);
  }

  return (
    <>
      <span className="bg-red-600  text-3xl text-white px-5 py-3 rounded-lg flex justify-center ">
        This section is under construction...
      </span>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow label="Start date" error={errors?.startDate?.message}>
          <Controller
            name="startDate"
            control={control}
            rules={{
              required: "Start date is required",
            }}
            render={({ field }) => (
              <div
                className="datepicker-container"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <DatePicker
                  {...field}
                  minDate={new Date()}
                  closeOnScroll={true}
                  showIcon
                  icon={<SlCalender />}
                  selected={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                    if (date) clearErrors("startDate");
                  }}
                  dateFormat="yyyy/MM/dd"
                  popperPlacement="bottom-start"
                  portalId="root"
                />
              </div>
            )}
          />
        </FormRow>
        <FormRow label="end date" error={errors?.endDate?.message}>
          <Controller
            name="endDate"
            control={control}
            rules={{
              required: "End date is required",
              validate: (endDate) => {
                if (!startDate || !endDate) return true;
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (end <= start) return "End date must be after start date";
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (minBookinLength > 0 && diffDays < minBookinLength) {
                  return `Minimum booking is ${minBookinLength} days`;
                }
                return true;
              },
            }}
            render={({ field }) => (
              <div
                className="datepicker-container"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <DatePicker
                  {...field}
                  closeOnScroll={true}
                  showIcon
                  icon={<SlCalender />}
                  selected={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                    if (date) clearErrors("endDate");
                  }}
                  dateFormat="yyyy/MM/dd"
                  minDate={startDate ? new Date(startDate) : null}
                  popperPlacement="bottom-start"
                  portalId="root"
                />
              </div>
            )}
          />
        </FormRow>
        <FormRow label="num Night" error={errors?.numNights?.message}>
          <Input
            type="number"
            id="numNights"
            {...register("numNights", {
              required: "This field is required",
              validate: (value) => {
                const endDate = watch("endDate");
                if (!startDate || !endDate) {
                  return "Start date and end date are required";
                }
                const start = new Date(startDate);
                const end = new Date(endDate);
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (minBookinLength > 0 && diffDays < minBookinLength) {
                  return `Minimum booking is ${minBookinLength} days`;
                }
                if (parseInt(value, 10) !== diffDays) {
                  return `Number of nights must match the difference between start and end dates (${diffDays} nights)`;
                }
                return true;
              },
            })}
          />
        </FormRow>
        <FormRow>
          <Button>Create new Booking</Button>
        </FormRow>
      </Form>
    </>
  );
}

export default CreateBookingForm;
