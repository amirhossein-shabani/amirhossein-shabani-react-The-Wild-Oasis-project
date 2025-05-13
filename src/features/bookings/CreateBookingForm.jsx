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
import { useBookings } from "../bookings/useBookings";
import { useCabins } from "../cabins/useCabins";
import { useDarkMode } from "../../context/DarkModeContext";
import { useValidateCabin } from "./useValidateCabin";

function CreateBookingForm() {
  const { settings, isLoading: settingIsLoading } = useSettings();
  const { bookings, isLoading: bookingsLoading } = useBookings();
  const { cabins, isLoading: cabinsLoading } = useCabins();
  const { isDarkMode } = useDarkMode();
  const { isCabinAvailable } = useValidateCabin();

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
  if (settingIsLoading || bookingsLoading || cabinsLoading) {
    return <p className="text-m pr-10">Loading ...</p>;
  }

  // Ensure minBookinLength is available and is a valid number
  const minBookinLength = settings.minBookinLength ?? 0;

  const startDate = watch("startDate");
  const endDate = watch("endDate");

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
        <FormRow label="Num Guests" error={errors?.numGuests?.message}>
          <Input
            type="number"
            id="numGuests"
            {...register("numGuests", {
              required: "This field is required",
              validate: (value) => {
                if (parseInt(value, 10) < 1) {
                  return "The number of guests must be at least 1";
                }
                return true;
              },
            })}
          />
        </FormRow>
        <FormRow label="Cabin" error={errors?.cabinId?.message}>
          <select
            id="cabinId"
            className={
              isDarkMode
                ? "bg-transparent border-solid border-l border-stone-300 px-2 py-2"
                : "bg-transparent border-solid border-l border-stone-600 px-2 py-2"
            }
            {...register("cabinId", {
              required: "This field is required",
              validate: (selectedCabinId) => {
                if (!isCabinAvailable(selectedCabinId, startDate, endDate)) {
                  return "The selected cabin is not available for the chosen dates.";
                }
                return true;
              },
            })}
          >
            <option
              value=""
              className={isDarkMode ? "bg-sky-800" : "bg-stone-100"}
            >
              Select a cabin
            </option>
            {cabins.map((cabin) => {
              // Filter out cabins that are unavailable
              const isUnavailable = bookings.some((booking) => {
                if (
                  booking.cabinId === cabin.id &&
                  (booking.status === "unconfirmed" ||
                    booking.status === "checked-in")
                ) {
                  const bookingStart = new Date(booking.startDate);
                  const bookingEnd = new Date(booking.endDate);

                  // Check for overlapping dates
                  return (
                    startDate &&
                    endDate &&
                    new Date(startDate) < bookingEnd &&
                    new Date(endDate) > bookingStart
                  );
                }
                return false;
              });

              return (
                <option
                  className={
                    isDarkMode
                      ? isUnavailable
                        ? "bg-sky-900 "
                        : "bg-sky-800"
                      : isUnavailable
                      ? "bg-stone-200"
                      : "bg-stone-100"
                  }
                  key={cabin.id}
                  value={cabin.id}
                  disabled={isUnavailable}
                >
                  {cabin.name} {isUnavailable ? "(Unavailable)" : ""}
                </option>
              );
            })}
          </select>
        </FormRow>
        <FormRow>
          <Button>Create new Booking</Button>
        </FormRow>
      </Form>
    </>
  );
}

export default CreateBookingForm;
