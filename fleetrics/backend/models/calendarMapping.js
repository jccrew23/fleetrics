import mongoose from 'mongoose';

const calendarMappingSchema = new mongoose.Schema({
    fleetioId: {
        type: Number,
        required: true,
        unique: true,
    },
    googleEventId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const CalendarMapping = mongoose.model('CalendarMapping', calendarMappingSchema);

export default CalendarMapping;