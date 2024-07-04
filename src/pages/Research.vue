<template>

    <!-- Search bar principale -->
    <section>
        <div class="address-research">
            <form action="" class="flex">
                <div class="address-research-input">
                    <label for="input">Address:</label>
                    <input type="text" id="input" placeholder="Via Vittoria 1, Roma, 00140">
                </div>
                <button class="address-research-btn"><font-awesome-icon :icon="['fas', 'magnifying-glass']" /></button>
            </form>
        </div>
    </section>

    <section>
        <div class="filter-container">
            <span><font-awesome-icon :icon="['fas', 'filter']" /></span>
            <p>More filters</p>
            <span><font-awesome-icon :icon="['fas', 'sort-down']" /></span>
        </div>
    </section>

    <section>
        <div class="research-row-articles">
            <article class="article-research">
                <div class="col-img">
                    <img src="" alt="">
                    <span>12,3 Km</span>
                </div>
                <div class="col-info">
                    <p>House for the perfect group vacation</p>
                    <div class="research-container-info">
                        <div class="research-article-info">
                            <img class="icon-info" src="/public/img/icon_room_01.png" alt="">
                            <span>Rooms</span>
                            <span>6</span>
                        </div>
                        <div>
                            <img class="icon-info" src="/public/img/icon_space_01.png" alt="">
                            <span>m ^2</span>
                            <span>173</span>
                        </div>
                        <div>
                            <img class="icon-info" src="/public/img/icon_room_01.png" alt="">
                            <span>Beds</span>
                            <span>4</span>
                        </div>
                        <div>
                            <img class="icon-info" src="/public/img/icon_bathroom_01.png" alt="">
                            <span>Bathroom</span>
                            <span>2</span>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
        }
    }

}
</script>

<style scoped></style>