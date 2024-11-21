<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button @click="prevMonth">←</button>
      <span>{{ monthName }} {{ currentYear }}</span>
      <button @click="nextMonth">→</button>
    </div>
    <div class="calendar-body">
      <div class="calendar-weekdays">
        <div v-for="day in weekdays" :key="day">{{ day }}</div>
      </div>
      <div class="calendar-days">
        <div v-for="day in blankDays" :key="`blank-${day}`" class="calendar-day blank"></div>
        <div
          v-for="day in daysInMonth"
          :key="`day-${day}`"
          class="calendar-day"
          :class="{ highlighted: highlightDates(day) }"
          @click="highlightDates(day) && showRecords(day)"   
        >
          {{ day }}
        </div>
      </div>
    </div>
    <div v-if="selectedRecords.length" class="modal-overlay" @click="selectedRecords = []">
      <div class="modal-content" @click.stop>
        <h3>Records for {{ selectedDate }}</h3>
        <ul>
          <li v-for="record in selectedRecords" :key="record.id">
            <strong>{{ record.exercise_name }}</strong>
            (Priority: {{ record.priority }}, Sets: {{ record.number_of_set }})
          </li>
        </ul>
        <button @click="selectedRecords = []">Close</button>
      </div>
    </div>
  </div>
</template>



<script>
import axios from "axios";

export default {
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      records: [], // store records from backend db
      selectedRecords: [], // records for the selected date
      selectedDate: "",
    };
  },
  computed: {
    monthName() {
      return new Date(this.currentYear, this.currentMonth).toLocaleString("default", {
        month: "long",
      });
    },
    weekdays() {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    },
    daysInMonth() {
      return Array.from(
        { length: new Date(this.currentYear, this.currentMonth + 1, 0).getDate() },
        (_, i) => i + 1
      );
    },
    blankDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      return Array.from({ length: firstDay });
    },
    recordsByDate() {
      const recordsByDate = {};
      this.records.forEach(record => {
        const date = new Date(record.start_time); // use start_time as highlight indicator
        console.log("Record Date", date);
        if (
          date.getFullYear() === this.currentYear &&
          date.getMonth() === this.currentMonth
        ) {
          const day = date.getDate();
          if (!recordsByDate[day]) recordsByDate[day] = [];
          recordsByDate[day].push(record);
        }
      });
      console.log("Records by Date:", recordsByDate); // debug yong
      return recordsByDate;
    },
  },
  methods: {
    async fetchRecords() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:3001/api/record", {   // record api
          params: { token },
        });
        console.log("API Response:", response.data); // check api response on f12
        this.records = Array.isArray(response.data.rows) ? response.data.rows : [];
        console.log("Fetched Records:", this.records); // also check record contents in console
      } catch (error) {
        console.error("Error fetching records:", error);
        this.records = [];
      }
    },

    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.fetchRecords();
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.fetchRecords();
    },
    highlightDates(day) {
      const hasRecord = !!this.recordsByDate[day];
      console.log(`Highlight for Day ${day}:`, hasRecord); // check highlight availability
      return hasRecord;
    },
    showRecords(day) {
      this.selectedDate = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      this.selectedRecords = this.recordsByDate[day] || [];
    },
  },
  created() {
    this.fetchRecords();
  },
};
</script>






<style scoped>
.calendar-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f5f5f5;
}
.calendar-header span {
  font-size: 1.2em;
  font-weight: bold;
}
.calendar-body {
  display: grid;
  grid-template-rows: auto 1fr;
  background-color: #ffffff;
  border: 1px solid #ddd;
}
.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  background-color: #f0f0f0;
  padding: 10px 0;
}
.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding: 10px 0;
}
.calendar-day {
  padding: 10px;
  cursor: pointer;
  position: relative;
}
.calendar-day.blank {
  background-color: #f5f5f5;
}
.calendar-day.highlighted {
  background-color: #ffeb3b;
  font-weight: bold;
}
.calendar-day:hover {
  background-color: #e0e0e0;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  text-align: center;
}
</style>