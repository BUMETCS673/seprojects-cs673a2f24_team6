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
          :class="getDayClass(day)"
          @click="onDayClick(day)"
        >
          {{ day }}
        </div>
      </div>
    </div>

    <!-- show selected dataitems in records and plans -->
    <div v-if="selectedRecords.length || selectedPlans.length" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>Details for {{ selectedDate }}</h3>
        <div v-if="selectedPlans.length">
          <h4>Plans:</h4>
          <ul>
            <li v-for="plan in selectedPlans" :key="plan.plan_id">
              <strong>{{ plan.title }}</strong>
              (Priority: {{ plan.priority }}, Frequency: {{ plan.frequency_type }})
            </li>
          </ul>
        </div>
        <div v-if="selectedRecords.length">
          <h4>Records:</h4>
          <ul>
            <li v-for="record in selectedRecords" :key="record.record_id">
              <strong>{{ record.exercise_name }}</strong>
              (Priority: {{ record.priority }}, Sets: {{ record.number_of_set }})
            </li>
          </ul>
        </div>
        <button @click="closeModal">Close</button>
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
      records: [],           // Store records from backend
      selectedRecords: [],   // Records for the selected date
      selectedDate: "",
      plans: [],             // Store plans from backend
      selectedPlans: [],     // Plans for the selected date
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
        const date = new Date(record.start_time);
        if (
          date.getFullYear() === this.currentYear &&
          date.getMonth() === this.currentMonth
        ) {
          const day = date.getDate();
          if (!recordsByDate[day]) recordsByDate[day] = [];
          recordsByDate[day].push(record);
        }
      });
      return recordsByDate;
    },
    plansByDate() {
      const plansByDate = {};
      for (const plan of this.plans) {
        if (plan.custom_day) {
          const date = new Date(plan.custom_day);
          if (
            date.getFullYear() === this.currentYear &&
            date.getMonth() === this.currentMonth
          ) {
            const day = date.getDate();
            if (!plansByDate[day]) plansByDate[day] = [];
            plansByDate[day].push(plan);
          }
        }
      }
      return plansByDate;
    },
  },



  methods: {
    async fetchRecords() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:3001/api/record", {
          params: { token: token },
        });
        this.records = Array.isArray(response.data.rows) ? response.data.rows : [];
      } catch (error) {
        console.error("Error fetching records:", error);
        this.records = [];
      }
    },
    async fetchPlans() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:3001/api/plan", {
          params: { token: token },
        });
        console.log("api response is:", response.data);   // debug

        if (Array.isArray(response.data.rows)) {
          this.plans = response.data.rows; 
        } else if (Array.isArray(response.data)) {
          this.plans = response.data;
        } else {
          console.warn("Unexpected response structure:", response.data);
          this.plans = [];
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        this.plans = [];
      }
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    getDayClass(day) {
      const { hasRecord, hasPlan } = this.highlightDates(day);
      if (hasRecord && hasPlan) {
        return 'has-both';
      } else if (hasRecord) {
        return 'has-record';
      } else if (hasPlan) {
        return 'has-plan';
      } else {
        return '';
      }
    },
    highlightDates(day) {
      const hasRecord = !!this.recordsByDate[day];
      const hasPlan = !!this.plansByDate[day];
      return { hasRecord, hasPlan };
    },
    onDayClick(day) {
      const { hasRecord, hasPlan } = this.highlightDates(day);
      if (hasRecord) {
        this.selectedRecords = this.recordsByDate[day] || [];
      } else {
        this.selectedRecords = [];
      }
      if (hasPlan) {
        this.selectedPlans = this.plansByDate[day] || [];
      } else {
        this.selectedPlans = [];
      }

      if (hasRecord || hasPlan) {
        this.selectedDate = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      }
    },
    closeModal() {
      this.selectedRecords = [];
      this.selectedPlans = [];
      this.selectedDate = "";
    },
  },
  created() {
    this.fetchRecords();
    this.fetchPlans();
  },


  watch: {
    currentMonth() {
      // The computed properties will reactively update
    },
    currentYear() {
      // The computed properties will reactively update
    },
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

.calendar-day.has-record {
  background-color: #ffeb3b; /* yellow for record day */
}
.calendar-day.has-plan {
  background-color: #add8e6; /* blue for plan day */
}
.calendar-day.has-both {
  background-color: #e61f18; /* red for record + plan day  */
}

</style>